# Knowledge Ingestion Pipeline

## Overview & Philosophy

This directory contains the complete data pipeline for processing raw knowledge sources (books, articles) and preparing them for use in the application's RAG (Retrieval-Augmented Generation) system.

The core philosophy of this pipeline is Distilled Principles over Raw Content. Simply ingesting entire books into a vector database results in a low signal-to-noise ratio. 

This pipeline is designed to meticulously extract the timeless, actionable principles from each source and store them in a structured format that enables advanced, production-grade retrieval strategies.

## System Architecture & Retrieval Strategy

The data structures and pipeline below are designed to support a sophisticated retrieval architecture in the main backend application, moving beyond simple top-k vector search.

### Structured Retrieval (Recursive)

To handle a growing library of books and articles, we employ a two-step recursive retrieval process. This prevents the search from getting diluted across irrelevant documents.

- Step 1: Document-Level Search: When a query is received, the system first searches against high-level Document Summaries to identify the 1-2 most relevant sources (e.g., which book is most likely to answer this question?).

- Step 2: Chunk-Level Search: The system then performs a second, targeted vector search for specific principles only within the chunks belonging to the documents identified in Step 1

### Dynamic Retrieval (Router)

Different user queries have different intents. A single retrieval method is insufficient. Our backend will use an AI Router to analyze the user's query and select the appropriate retrieval tool.

	User Query -> AI Router -> [Selects one of the following sub-tools]
	                  |
	                  +--> Question-Answer Retriever (Uses Recursive Retrieval for specific facts)
	                  |
	                  +--> Full-Source Summarizer (Retrieves all principles from a source for broad summaries)
	                  |
	                  +--> Comparison Retriever (Retrieves from multiple sources to compare/contrast)

This architecture ensures that the context provided to the final LLM is highly relevant and tailored to the user's specific task.

## Core Data Structures

This is the target data structure for every individual principle. The vector embedding is created from the `distilled_principle`:

```json
	{
	  "distilled_principle": "The Mr. Market analogy teaches investors to use market fluctuations as opportunities rather than letting them dictate emotional decisions.",
	  "original_text": "Imagine that in some private business you own a small share that cost you $1,000. One of your partners, named Mr. Market, is very obliging indeed...",
	  "metadata": {
	    "source_book": "The Intelligent Investor",
	    "chapter": "8: Mr. Market and the Margin of Safety",
	    "page_number": 203
	  }
	}
```

This structure is used for the first step of our recursive retrieval. The embedding is created from the `summary_text`.

```json
	{
	  "summary_text": "A high-level summary of all the core principles contained within 'The Intelligent Investor', focusing on concepts like Mr. Market, Margin of Safety, and the criteria for defensive investing.",
	  "metadata": {
	    "source_book": "The Intelligent Investor"
	  }
	}
```

## The Distillation Pipeline

To achieve this high-quality output, we use a multi-stage, automated pipeline.

### Stage 1: Broad Extraction

- Goal: Extract every potential principle and its original text from a source, chapter by chapter.
- Process: An LLM is called with the "Extraction Prompt". The script adds metadata.
- Output: A raw list of "Hybrid Chunk" JSON objects.

### Stage 2: Synthesis & Deduplication

- Goal: Refine the raw output into a clean set of canonical principles.
- Process: An LLM is called with the "Synthesis Prompt" to create a "deduplication map". The script uses this map to merge the full Hybrid Chunk objects.
- Output: A final, clean list of unique "Hybrid Chunk" objects for a single source.

### Stage 2.5: Document Summary Generation

- Goal: Create the high-level summary needed for recursive retrieval.
- Process: After Stage 2 is complete for a source, all the final `distilled_principle` strings are fed to an LLM with a "Summarization Prompt".
- Output: A single "Document Summary" JSON object.

### Stage 3: Loading

- Goal: Load all processed knowledge into the vector database.
- Process: The script uploads both the final "Hybrid Chunks" and the "Document Summary" objects (along with their respective embeddings) to the vector database.

## Core Prompts

### Prompt for Stage 1: Extraction

```
Your task is to read the following text from an investment book and extract distinct, actionable principles, frameworks, mental models, and explicit rules.

For each principle you find, you must extract two things:
1.  A concise, one-sentence summary of the principle.
2.  The exact, verbatim original text from the book that defines or best explains this principle.

**You must output your findings as a list of JSON objects.** Each object in the list must have exactly two keys: `distilled_principle` and `original_text`.

---
### Ideal Example of a Single JSON Object

{
  "distilled_principle": "The Mr. Market analogy teaches investors to use market fluctuations as opportunities rather than letting them dictate emotional decisions.",
  "original_text": "Imagine that in some private business you own a small share that cost you $1,000. One of your partners, named Mr. Market, is very obliging indeed. Every day he tells you what he thinks your interest is worth and furthermore offers either to buy you out or to sell you an additional interest on that basis. Sometimes his idea of value appears plausible and justified by business developments and prospects as you know them. Often, on the other hand, Mr. Market lets his enthusiasm or his fears run away with him, and the value he proposes seems to you a little short of silly."
}
---

If you find multiple principles in the provided text, return a list containing multiple JSON objects in the exact format shown above.

If you find no actionable principles in the text, you must return an empty list: `[]`.

### Text to Analyze
"""
[Insert the text of one chapter here]
"""
```

### Prompt for Stage 2: Synthesis

```
You have been given a numbered list of principle summaries extracted from a single book. Your task is to identify summaries that describe the same core concept and group their indexes for deduplication.

**Instructions:**
1.  Analyze the provided list of summaries.
2.  Identify all summaries that refer to the same underlying principle, even if worded differently.
3.  Return a JSON list of lists. Each inner list must contain the integer indexes of the summaries that should be merged into a single, canonical principle. Every index from the input list must appear in exactly one group in the output.

---
### Example

**Input Summaries:**
1. A principle about margin of safety.
2. A principle about investor psychology.
3. A rule for ensuring a buffer between price and value.
4. A unique principle about diversification.
5. A warning against letting fear and greed drive decisions.

**Ideal JSON Output:**
[[1, 3], [2, 5], [4]]
---

### Summaries to Analyze
"""
[Insert a numbered list of all distilled_principle strings here, one per line]
"""
```

### Prompt for Stage 2.5: Document Summary Generation

```
You have been provided with a list of all the core, distilled principles from the book.

Your task is to write a concise, encyclopedic summary of the book's overall philosophy. The summary should be 3-5 sentences long and capture the main themes and concepts presented in the principles. This summary will be used to help a retrieval system decide if this book is relevant to a user's query.

Do not describe the principles one by one. Instead, synthesize them into a holistic overview of the author's mindset.

---
### Example

**Input Principles:**
- The Mr. Market analogy teaches investors to use market fluctuations as opportunities...
- The Margin of Safety is the central concept of investment...
- A defensive investor must insist on a buffer between the price paid and the underlying value...
- An enterprising investor can look for special situations...

**Ideal Summary Output:**
This book champions a value investing philosophy centered on the 'Margin of Safety' principle, ensuring a buffer between price and intrinsic value. It introduces the 'Mr. Market' analogy to promote a rational, business-like approach to market fluctuations, distinguishing between the roles of a defensive and an enterprising investor. The core methodology emphasizes thorough analysis, risk management, and avoiding speculation.
---

### Principles to Summarize
"""
[Insert the final, deduplicated list of all distilled_principle strings for the book here]
"""
```