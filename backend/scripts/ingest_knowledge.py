#!/usr/bin/env python3
"""
Script to ingest knowledge into the RAG system.
This script would handle processing and uploading documents, books, articles, 
and other content into the vector database.
"""

import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import from app
sys.path.append(str(Path(__file__).parent.parent))

from app.services.rag_service import RAGService


def ingest_document(file_path: str, user_id: str = None):
    """
    Ingest a single document into the knowledge base.
    
    Args:
        file_path: Path to the document to ingest
        user_id: Optional user ID for personal notes
    """
    print(f"Ingesting document: {file_path}")
    
    # This would contain the actual implementation for:
    # 1. Reading the document (PDF, txt, docx, etc.)
    # 2. Chunking the content appropriately
    # 3. Creating embeddings
    # 4. Storing in vector database (Pinecone, etc.)
    
    # Placeholder implementation
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} does not exist")
        return False
    
    print(f"Document {file_path} ingested successfully!")
    return True


def ingest_directory(directory_path: str, user_id: str = None):
    """
    Ingest all documents in a directory.
    
    Args:
        directory_path: Path to the directory containing documents
        user_id: Optional user ID for personal notes
    """
    print(f"Ingesting all documents in: {directory_path}")
    
    if not os.path.exists(directory_path):
        print(f"Error: Directory {directory_path} does not exist")
        return
    
    # Process all supported file types
    supported_extensions = ['.txt', '.pdf', '.docx', '.md']
    
    for file_path in Path(directory_path).glob('**/*'):
        if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
            ingest_document(str(file_path), user_id)


def main():
    """Main function to handle command line arguments."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Ingest knowledge into the RAG system")
    parser.add_argument("path", help="Path to file or directory to ingest")
    parser.add_argument("--user-id", help="User ID for personal notes")
    
    args = parser.parse_args()
    
    if os.path.isfile(args.path):
        ingest_document(args.path, args.user_id)
    elif os.path.isdir(args.path):
        ingest_directory(args.path, args.user_id)
    else:
        print(f"Error: {args.path} is not a valid file or directory")


if __name__ == "__main__":
    main() 