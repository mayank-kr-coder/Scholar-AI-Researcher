import sys
import json
import re
from collections import Counter
import math

# A standard set of English stopwords to filter out from scientific keyword extraction
STOPWORDS = set([
    'the', 'of', 'and', 'to', 'in', 'is', 'that', 'for', 'on', 'with', 'as', 'by', 'an', 'at', 'be',
    'this', 'are', 'from', 'it', 'or', 'was', 'were', 'which', 'but', 'not', 'we', 'our', 'using',
    'used', 'paper', 'model', 'results', 'proposed', 'based', 'using', 'study', 'analysis', 'method',
    'approach', 'data', 'performance', 'system', 'results', 'new', 'learning', 'neural', 'networks',
    'framework', 'different', 'presents', 'present', 'algorithm', 'experiments', 'evaluation', 'also',
    'has', 'have', 'can', 'should', 'could', 'would', 'will', 'about', 'their', 'there', 'they', 'them',
    'more', 'most', 'some', 'any', 'all', 'both', 'each', 'such', 'into', 'than', 'then', 'its'
])

def clean_text(text):
    # Remove citations like [1], (Vaswani et al., 2017)
    text = re.sub(r'\[\d+\]', '', text)
    text = re.sub(r'\(\w+\s+et\s+al\.,\s+\d{4}\)', '', text)
    return text

def calculate_readability(words_list, sentences_count):
    if not words_list or sentences_count == 0:
        return 0
    # Simple Automated Readability Index (ARI) approximation
    characters_count = sum(len(word) for word in words_list)
    words_count = len(words_list)
    
    score = 4.71 * (characters_count / words_count) + 0.5 * (words_count / sentences_count) - 21.43
    return max(1.0, round(score, 1))

def extract_keywords(words_list):
    # Filter words to keep only alphabetic strings of length > 3 and not in stopwords
    filtered_words = [
        word.lower() for word in words_list 
        if word.isalpha() and len(word) > 3 and word.lower() not in STOPWORDS
    ]
    
    counter = Counter(filtered_words)
    # Get top 8 most common scientific keywords
    return [word for word, count in counter.most_common(8)]

def main():
    try:
        # Read raw text from standard input
        raw_text = sys.stdin.read()
        if not raw_text.strip():
            print(json.dumps({"error": "Empty input text"}))
            return

        cleaned = clean_text(raw_text)
        
        # Tokenize sentences and words simple approximations
        sentences = [s.strip() for s in re.split(r'[.!?]+', cleaned) if s.strip()]
        words = re.findall(r'\b\w+\b', cleaned)
        
        total_words = len(words)
        unique_words = len(set(w.lower() for w in words))
        sentences_count = len(sentences)
        
        # Calculate Python ML Metrics
        lexical_diversity = round(unique_words / total_words, 3) if total_words > 0 else 0
        reading_time_mins = max(1, math.ceil(total_words / 220)) # Avg adult reads 220 wpm
        readability_grade = calculate_readability(words, sentences_count)
        top_keywords = extract_keywords(words)
        
        # Prepare final statistics object
        analytics = {
            "wordCount": total_words,
            "sentenceCount": sentences_count,
            "lexicalDiversity": lexical_diversity,
            "estimatedReadingTime": f"{reading_time_mins} min",
            "readabilityGrade": f"Grade {readability_grade} (Academic Level)" if readability_grade > 12 else f"Grade {readability_grade}",
            "topKeywords": top_keywords,
            "pythonEngineVersion": "Python 3.x (Standard NLP Pipeline)"
        }
        
        print(json.dumps(analytics))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
