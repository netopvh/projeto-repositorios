# Controle de Repositórios do Github

Esta é uma aplicação de exemplo para fins de teste, desenvolvida com foco em uma arquitetura limpa e modular, facilitando sua escalabilidade e manutenção.

## Tecnologias Utilizadas
- **Docker**: Containerização de toda a aplicação para facilitar o deploy e a replicação do ambiente.
- **NestJS**: Framework para o backend, implementado em TypeScript, seguindo princípios de design modular.
- **TypeScript**: Linguagem utilizada para maior segurança e escalabilidade do código.
- **MariaDB**: Banco de dados relacional para persistência de dados.
- **RabbitMQ**: Sistema de filas para processamento assíncrono e comunicação entre serviços.

---

## Rodar os containers da aplicação

Para iniciar a aplicação, basta rodar o comando abaixo que todos os serviços serão iniciados de forma automática.
Se for a primeira vez que realiza a ação, o processo é um pouco demorado pois precisa baixar as imagens.

```bash
docker compose up -d --build
```

## Acessando a Aplicação

Após executar os comandos acima, acesse a aplicação pelo navegador no endereço:

http://localhost:5173

A aplicação foi desenvolvida como um exemplo para avaliação técnica, refletindo boas práticas de desenvolvimento e organização do código.