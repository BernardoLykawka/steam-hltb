# Use imagem base oficial
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Gera build do projeto (caso seja Next.js)
RUN npm run build

# Expõe a porta 3000 (Next.js usa essa por padrão)
EXPOSE 3000

# Comando de start (ajuste se necessário)
CMD ["npm", "start"]
