# Overview & Philosophy

This directory contains the complete data pipeline for processing raw knowledge sources (books, articles) and preparing them for use in the application's RAG (Retrieval-Augmented Generation) system.

# The "Hybrid Chunk" Data Structure

This is the target data structure for every piece of knowledge loaded into our vector database. The vector embedding will be created from the distilled_principle to ensure search is fast and relevant. The entire JSON object will be stored as the metadata payload.

```json
	{
	  "distilled_principle": "The Mr. Market analogy teaches investors to use market fluctuations as opportunities rather than letting them dictate emotional decisions.",
	  "original_text": "Imagine that in some private business you own a small share that cost you $1,000. One of your partners, named Mr. Market, is very obliging indeed. Every day he tells you what he thinks your interest is worth and furthermore offers either to buy you out or to sell you an additional interest on that basis. Sometimes his idea of value appears plausible and justified by business developments and prospects as you know them. Often, on the other hand, Mr. Market lets his enthusiasm or his fears run away with him, and the value he proposes seems to you a little short of silly.",
	  "metadata": {
	    "source_book": "The Intelligent Investor",
	    "chapter": "8: Mr. Market and the Margin of Safety",
	    "page_number": 203
	  }
	}
```

# The Distillation Pipeline

To achieve this high-quality output in an automated fashion, we use a two-stage pipeline.

## Stage 1: Broad Extraction

The goal of this stage is to perform a first pass over the source material (e.g., a book PDF), chapter by chapter, and extract every potential principle along with its original text.

- Input: Raw text from a single chapter.
- Process: An LLM is called with the "Extraction Prompt" to identify and pull out principles. The Python script running the process is responsible for adding the metadata (source, chapter, page number).
- Output: A raw list of "Hybrid Chunk" JSON objects, which may contain duplicates or disorganized information.

## Stage 2: Synthesis & Deduplication

The goal of this stage is to take the raw, repetitive output from Stage 1 and refine it into a final, clean set of canonical principles.

- Input: The complete list of raw "Hybrid Chunks" from Stage 1.
- Process: An LLM is called with the "Synthesis Prompt," using only the distilled_principle strings. The LLM's job is to identify which principles are duplicates and should be merged. The Python script then uses this "deduplication map" to merge the full JSON objects, selecting the best original_text quote.
- Output: A final, clean list of unique "Hybrid Chunk" objects.

## Stage 3: Loading

The final step is to load the processed knowledge into the vector database.

- Input: The final list of unique "Hybrid Chunk" objects.
- Process: For each object, an embedding is generated from the distilled_principle text. This embedding and the full JSON object are then uploaded to the vector database (Pinecone).

# Core Prompts

These prompts are stored in the prompts / directory and are the "brains" of the pipeline.

## Prompt for Stage 1: Extraction

```
	Your task is to read the following text from an investment book and extract distinct, actionable principles.
	
	For each principle you find, you must extract two things:
	1.  A concise, one-sentence summary of the principle.
	2.  The exact, verbatim original text from the book that defines or best explains this principle.
	
	**You must output your findings as a list of JSON objects.** Each object in the list must have exactly two keys: `distilled_principle` and `original_text`.
	
	---
	
	**Here is an ideal example of a single JSON object you should produce:**
	
	{
	  "distilled_principle": "The Mr. Market analogy teaches investors to use market fluctuations as opportunities rather than letting them dictate emotional decisions.",
	  "original_text": "Imagine that in some private business you own a small share that cost you $1,000. One of your partners, named Mr. Market, is very obliging indeed. Every day he tells you what he thinks your interest is worth and furthermore offers either to buy you out or to sell you an additional interest on that basis. Sometimes his idea of value appears plausible and justified by business developments and prospects as you know them. Often, on the other hand, Mr. Market lets his enthusiasm or his fears run away with him, and the value he proposes seems to you a little short of silly."
	}
	
	---
	
	If you find multiple principles in the provided text, return a list containing multiple JSON objects in the exact format shown above.
	
	If you find no actionable principles in the text, you must return an empty list: `[]`.
	
	**Text to Analyze:**
	"""
	[Insert the text of one chapter here]
	"""
```

## Prompt for Stage 2: Synthesis

```
	You are a master editor and financial author. You have been given a raw list of extracted investment principles from a single book. Your task is to synthesize these into a final, clean, and well-structured set.
	
	**Instructions:**
	1.  **Analyze the list of summaries:** Identify summaries that describe the same core concept.
	2.  **Group Duplicates:** Return a list of lists, where each inner list contains the indexes of the summaries that should be merged into a single, canonical principle.
	
	**Example:** If summaries at index 2, 15, and 45 are all about the "Margin of Safety," you should return `[[2, 15, 45], ...]`. If a summary at index 8 is unique, it should be in its own group: `[..., [8], ...]`.
	
	**Summaries to Analyze:**
	"""
	[Insert a numbered list of all `distilled_principle` strings here]
	"""
```