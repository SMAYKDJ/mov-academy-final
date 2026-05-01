import os
import re

english_keywords = ["the", "is", "to", "for", "if", "we", "are", "actually", "when", "clicking", "link", "based", "on", "selected", "month", "with", "weekend", "drops", "states", "cleaning", "defaults", "check", "simulate", "dynamic", "memoized", "drawer", "basic", "data", "persistence", "fetch", "load", "render", "user", "file", "error", "success", "this", "that", "it", "then", "else", "return", "function", "const", "let", "var", "import", "export"]

# We only want to match these as whole words in comments
regexes = [re.compile(rf"\b{word}\b", re.IGNORECASE) for word in ["the", "this", "that", "when", "how", "what", "where", "why", "who", "with", "without", "will", "would", "should", "could", "can", "cannot", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "not", "and", "but", "or", "because", "as", "until", "while", "of", "at", "by", "for", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "data", "persistence", "fetch", "load", "render", "simulate"]]

def is_english(comment):
    # check if comment has english keywords
    count = 0
    for r in regexes:
        if r.search(comment):
            count += 1
    return count > 1 # require at least 2 english words to avoid false positives

for root, dirs, files in os.walk("."):
    if "node_modules" in root or ".next" in root or ".git" in root or ".venv" in root:
        continue
    for file in files:
        if file.endswith((".ts", ".tsx", ".py", ".js", ".jsx")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
            except Exception:
                continue
            
            for i, line in enumerate(lines):
                comment = None
                if ("//" in line):
                    comment = line.split("//", 1)[1]
                elif ("#" in line and path.endswith(".py")):
                    comment = line.split("#", 1)[1]
                elif ("/*" in line):
                    # ignoring multiline for simplicity unless it's on one line
                    if "*/" in line:
                        comment = line.split("/*")[1].split("*/")[0]
                        
                if comment and is_english(comment):
                    # Filter out obvious portuguese words
                    pt_words = ["para", "com", "os", "as", "um", "uma", "na", "no", "em", "como", "quando", "onde", "porque", "se", "o", "a", "é", "são", "foi", "foram", "ser", "estar", "ter", "fazer", "dizer", "poder", "saber", "ver", "dar", "ir", "vir", "querer", "ficar", "achar", "deixar", "levar", "começar", "sentir", "usar", "encontrar", "passar", "falar", "mostrar", "parecer", "chamar", "acreditar", "pensar", "criar", "entender", "tentar", "voltar", "precisar", "perguntar", "ouvir", "olhar", "trabalhar", "ajudar", "gostar", "colocar", "escrever", "lembrar", "esperar", "continuar", "ler", "receber", "abrir", "fechar", "mudar", "jogar", "ganhar", "perder", "comprar", "vender", "pagar", "pagamento"]
                    pt_count = sum(1 for w in pt_words if re.search(rf"\b{w}\b", comment, re.IGNORECASE))
                    if pt_count < 2:
                        print(f"{path}:{i+1}: {line.strip()}")
