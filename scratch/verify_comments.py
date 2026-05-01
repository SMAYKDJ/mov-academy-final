import os
import re

strict_english_words = [
    "the", "this", "that", "when", "where", "why", "how", "what", "which",
    "with", "without", "will", "would", "should", "could", "cannot", "are", 
    "were", "have", "has", "had", "does", "did", "because", "until", "while", 
    "only", "their", "they", "them", "from", "into", "through", "during", "before", "after",
    "above", "below", "down", "off", "over", "under", "again", "further", "then", "once",
    "here", "there", "any", "both", "each", "few", "most", "other", "some", "such",
    "only", "own", "same", "very", "just", "now", "data", "persistence", "fetch", "load", "render"
]

# regex to match whole words
regexes = [re.compile(rf"\b{word}\b", re.IGNORECASE) for word in strict_english_words]

def check_comment(comment):
    # filter out URLs which often contain english words
    if "http://" in comment or "https://" in comment:
        return False
        
    for r in regexes:
        if r.search(comment):
            return True
    return False

found = 0
for root, dirs, files in os.walk("."):
    if "node_modules" in root or ".next" in root or ".git" in root or ".venv" in root or "scratch" in root:
        continue
    for file in files:
        if file.endswith((".ts", ".tsx", ".py", ".js", ".jsx", ".css")):
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
                elif ("/*" in line and "*/" in line):
                    comment = line.split("/*")[1].split("*/")[0]
                        
                if comment and check_comment(comment):
                    # Filter out obvious portuguese words
                    pt_words = ["para", "com", "os", "as", "um", "uma", "na", "no", "em", "como", "quando", "onde", "porque", "se", "o", "a", "é", "são", "foi", "foram", "ser", "estar", "ter", "fazer", "dizer", "poder", "saber", "ver", "dar", "ir", "vir", "querer", "ficar", "achar", "deixar", "levar", "começar", "sentir", "usar", "encontrar", "passar", "falar", "mostrar", "parecer", "chamar", "acreditar", "pensar", "criar", "entender", "tentar", "voltar", "precisar", "perguntar", "ouvir", "olhar", "trabalhar", "ajudar", "gostar", "colocar", "escrever", "lembrar", "esperar", "continuar", "ler", "receber", "abrir", "fechar", "mudar", "jogar", "ganhar", "perder", "comprar", "vender", "pagar", "pagamento"]
                    pt_count = sum(1 for w in pt_words if re.search(rf"\b{w}\b", comment, re.IGNORECASE))
                    if pt_count < 2:
                        print(f"{path}:{i+1}: {line.strip()}")
                        found += 1
                        
print(f"Total found: {found}")
