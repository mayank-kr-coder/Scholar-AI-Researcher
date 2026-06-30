import { SamplePaper } from "./types";

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    subtitle: "The foundational paper introducing the Transformer architecture.",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
    textSnippet: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature. We show that the Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.`,
    analysis: {
      title: "Attention Is All You Need",
      authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
      summary: "This seminal paper introduces the Transformer, a novel sequence-to-sequence model architecture that discards recurrent neural networks (RNNs) and convolutional layers entirely, relying solely on self-attention mechanisms. By enabling long-range dependencies to be computed in parallel, the Transformer revolutionized natural language processing (NLP) and formed the core foundation for subsequent modern Large Language Models (LLMs).",
      findings: [
        "The Transformer achieves state-of-the-art translation quality on WMT 2014 English-to-German (28.4 BLEU) and English-to-French (41.8 BLEU) tasks.",
        "Dispensing with recurrence allows extreme parallelization during training, dramatically reducing training times (3.5 days on 8 GPUs compared to weeks for RNN-based state-of-the-art systems).",
        "The model demonstrates excellent generalization capabilities by achieving high performance on English constituency parsing with both limited and extensive training datasets.",
        "Self-attention layers have constant maximum path lengths between any two positions, reducing the computational complexity of learning dependencies across long sequences."
      ],
      methodology: {
        design: "Empirical machine learning architecture design, benchmarking, and comparative translation evaluation.",
        dataset: "WMT 2014 English-to-German dataset (4.5 million sentence pairs) and WMT 2014 English-to-French dataset (36 million sentence pairs), along with the Wall Street Journal (WSJ) corpus for parsing.",
        approach: "Encoder-Decoder architecture utilizing Multi-Head Self-Attention, Scaled Dot-Product Attention, positional encodings to replace recurrent step ordering, and residual connections with layer normalization.",
        limitations: "The model's quadratic complexity O(n²) with respect to sequence length 'n' makes it computationally expensive for extremely long documents, and it lacks an inductive bias for sequential order, requiring artificial positional encodings."
      },
      contributions: [
        "The invention of the Self-Attention mechanism as a standalone replacement for recurrence and convolution in sequence-to-sequence modelling.",
        "Introduction of the Multi-Head Attention mechanism, which allows the model to jointly attend to information from different representation subspaces at different positions.",
        "Pioneered the foundation for modern Generative AI and LLMs (such as GPT, BERT, and Gemini) by removing sequential computing bottlenecks."
      ],
      suggestedQuestions: [
        "What is the difference between Scaled Dot-Product Attention and standard Dot-Product Attention?",
        "Why does the Transformer require positional encodings, and how are they calculated?",
        "How does Multi-Head Attention help the model capture multiple distinct relationships in a sentence?"
      ]
    }
  },
  {
    id: "gemini-1-5",
    title: "Gemini 1.5: Unlocking Multimodal Understanding Across Millions of Tokens",
    subtitle: "Google's breakthrough multimodal model supporting massive context windows.",
    authors: "Gemini Team, Google",
    textSnippet: `In this report, we present Gemini 1.5, a family of highly capable multimodal models developed by Google. Gemini 1.5 Pro introduces a revolutionary long-context window capability, supporting up to 1 million or more tokens in a single context window. This allows the model to ingest entire codebases, hours of audio, dozens of long-form research papers, or entire books. We demonstrate that Gemini 1.5 Pro achieves near-perfect retrieval on 'needle-in-a-haystack' tests across text, video, and audio modalities. Furthermore, Gemini 1.5 Pro employs a highly optimized Mixture-of-Experts (MoE) architecture, maintaining fast inference speeds and lower training compute despite its massive capability. The model demonstrates advanced reasoning, translation, and analytical performance across a wide suite of quantitative benchmarks, surpassing prior models like Gemini 1.0 Ultra on multiple evaluations while requiring substantially less training compute.`,
    analysis: {
      title: "Gemini 1.5: Unlocking Multimodal Understanding Across Millions of Tokens",
      authors: "Gemini Team, Google",
      summary: "This report introduces Gemini 1.5 Pro, Google's highly advanced multimodal model designed around a sparse Mixture-of-Experts (MoE) architecture. Its breakthrough capability is the native support for a 1-million-token (and experimental 10-million-token) context window, enabling deep cross-modal reasoning across massive volumes of text, video, audio, and codebases in a single prompt.",
      findings: [
        "Gemini 1.5 Pro achieves 99% or higher recall on 'Needle In A Haystack' (NIAH) retrieval tests across text, audio, and video modalities up to 1 million tokens.",
        "The model demonstrates in-context learning of entirely new languages (e.g., Kalamang, spoken by fewer than 200 people) using only a grammar manual and bilingual dictionary included in its prompt.",
        "Ingests and reasons over massive multimodal codebases (up to 100,000 lines of code) and hours of video recordings, showing direct, cross-modal video-to-text semantic searching.",
        "The sparse Mixture-of-Experts (MoE) architecture ensures high computational efficiency, achieving faster throughput and lower resource demands compared to traditional dense transformer networks."
      ],
      methodology: {
        design: "Large-scale multimodal neural network engineering, sparse model architecture benchmarking, and empirical evaluations on international NLP, reasoning, and multimodal datasets.",
        dataset: "Diverse pretraining corpus consisting of high-quality multilingual text, computer code, high-resolution images, video files, and audio recordings. Benchmarked against MMLU, GSM8K, MATH, HumanEval, and NIAH.",
        approach: "Sparse Mixture-of-Experts (MoE) Transformer structure where routing networks send tokens to specialized expert networks, coupled with advanced long-attention mechanisms and multimodal tokenizers.",
        limitations: "Extreme context lengths lead to linear increases in overall latency during the pre-fill stage, and very long prompts can suffer from high token billing/compute costs in production settings."
      },
      contributions: [
        "Demonstrated the viability of native, robust 1M+ token context processing without the severe performance decay historically seen in attention mechanisms.",
        "Pioneered cross-modal long-context retrieval, allowing seamless unified reasoning across text, code, audio, and video formats simultaneously.",
        "Proven execution of highly efficient sparse MoE architectures for production-scale, multimodal large foundation models."
      ],
      suggestedQuestions: [
        "What is a sparse Mixture-of-Experts (MoE) architecture and how does it optimize inference?",
        "How did Gemini 1.5 demonstrate in-context learning with the Kalamang language?",
        "What are the implications of a 1-million-token context window on traditional RAG pipelines?"
      ]
    }
  },
  {
    id: "rag-paper",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    subtitle: "The pioneering work combining parametric and non-parametric memory.",
    authors: "Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela",
    textSnippet: `Large pre-trained language models have been shown to store implicit knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and they can hallucinate factually incorrect statements. We introduce Retrieval-Augmented Generation (RAG)—a general-purpose fine-tuning recipe that combines pre-trained parametric memory (such as a generator model) with non-parametric memory (such as a dense vector index of Wikipedia) to retrieve documents and generate fluent text. We explore two formulations: RAG-Sequence, which uses the same retrieved document to generate the entire sequence, and RAG-Token, which can retrieve different documents for each token. We show that RAG models achieve state-of-the-art results on several knowledge-intensive NLP benchmarks, such as open-domain question answering (TriviaQA, WebQuestions, Jeopardy), while producing more factual, specific, and diverse responses than parametric-only models.`,
    analysis: {
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      authors: "Patrick Lewis, Ethan Perez, Aleksandara Piktus, Douwe Kiela, et al. (Facebook AI Research)",
      summary: "This seminal paper introduces Retrieval-Augmented Generation (RAG), an architectural framework that enhances pre-trained sequence-to-sequence language models (parametric memory) with an external, non-parametric document retriever (dense vector index). RAG addresses the limitations of LLMs, such as hallucinations, lack of factual precision, and outdated parameters, by feeding relevant, dynamically retrieved document context to the model at generation time.",
      findings: [
        "RAG models outperform traditional fine-tuned parametric models on open-domain question answering tasks (TriviaQA, WebQuestions, Jeopardy) without requiring massive model parameters.",
        "RAG-Token models generate more diverse, specific, and factually correct responses, with significantly reduced hallucination rates compared to standard sequence-to-sequence generators.",
        "RAG can successfully update its world knowledge dynamically simply by replacing or updating the underlying document index, entirely bypassing the need for costly model retraining.",
        "On Jeopardy question generation, RAG models are rated by human evaluators as more factual and specifically informative than parametric-only counterparts."
      ],
      methodology: {
        design: "Comparative algorithmic design, experimental evaluation across diverse question-answering benchmarks, and human evaluation trials.",
        dataset: "Wikipedia December 2018 dump (split into 21-million 100-word blocks) as the non-parametric index; evaluated on TriviaQA, WebQuestions, Jeopardy, and MS-MARCO datasets.",
        approach: "Dense Passage Retriever (DPR) utilizing a bi-encoder architecture to construct vector embeddings, combined with a pre-trained BART-large model as the sequence generator. Two mathematical formulations are tested: RAG-Sequence and RAG-Token.",
        limitations: "RAG relies heavily on the quality and ranking of the retriever; if the vector database fails to locate relevant documents, the generator cannot synthesize accurate responses. It also incurs increased computational latency due to the dual retriever-generator forward pass."
      },
      contributions: [
        "The introduction of the unified RAG framework, establishing the standard pattern for modern enterprise LLM search and document-grounded answer generation.",
        "Formulated the joint training of neural dense retrievers with abstractive generators under a single end-to-end backpropagation loop.",
        "Proved that combining non-parametric factual retrieval with fluent language generation yields superior accuracy and safer model behaviors than parametric scaling alone."
      ],
      suggestedQuestions: [
        "What is the difference between RAG-Sequence and RAG-Token models?",
        "How does the Dense Passage Retriever (DPR) find relevant documents compared to BM25?",
        "How does RAG help prevent hallucinations in language models?"
      ]
    }
  }
];
