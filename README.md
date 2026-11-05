# Next Social Media

Rede social full-stack em Next.js com publicações, imagens, gostos, comentários, seguidores e notificações.

> **Âmbito do projecto:** este é um projecto de estudo. Fi-lo para me familiarizar com o Next.js (App Router e Server Actions), o Prisma com PostgreSQL, a autenticação com Clerk e o upload de ficheiros com UploadThing, e para pôr em prática a modelação de relações entre utilizadores, publicações e notificações. Não é um produto final.

## Demo

🔗 **[Ver demo](COLOCA_AQUI_O_LINK_DA_DEMO)**

## Funcionalidades

- Autenticação com **Clerk** (registo, login e perfil); o utilizador é sincronizado com a base de dados
- Criar publicações com texto e imagem (upload com UploadThing, até 4 MB)
- Feed de publicações
- Gostos, comentários e remoção das próprias publicações (com confirmação)
- Seguir e deixar de seguir utilizadores, com sugestões de quem seguir
- Notificações de gostos, comentários e novos seguidores, com marcação como lidas
- Página de perfil (`/profile/<username>`) com separadores de publicações e gostos, e edição de nome, bio, localização e website
- Modo claro, escuro ou de acordo com o sistema
- Layout responsivo, com navegação própria para desktop e para celular

## Tecnologias

- **Next.js 16** (App Router + Server Actions) · **React 19** · **TypeScript**
- **Prisma 7** + **PostgreSQL**
- **Clerk** (autenticação)
- **UploadThing** (upload de imagens)
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI) · next-themes · Lucide e Phosphor Icons
- date-fns · react-hot-toast

## Modelo de dados

`User` · `Post` · `Comment` · `Like` · `Follows` · `Notification` (tipos: like, comentário, seguir). Está tudo definido em `prisma/schema.prisma`.

## Como correr localmente

### Pré-requisitos

- **Node.js 20.9 ou superior**
- Uma base de dados **PostgreSQL** (local ou num serviço como [Neon](https://neon.tech) ou [Supabase](https://supabase.com))
- Uma conta **[Clerk](https://clerk.com)**
- Uma conta **[UploadThing](https://uploadthing.com)**

### 1. Clonar e instalar

```bash
git clone https://github.com/Cleyton-Tembe/Next-SocialMedia.git
cd Next-SocialMedia
npm install
```

### 2. Variáveis de ambiente

Cria um ficheiro `.env` na raiz:

```env
# PostgreSQL
DB_URL=postgresql://<utilizador>:<password>@<host>:5432/<base-de-dados>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# UploadThing
UPLOADTHING_TOKEN=...
```

### 3. Preparar a base de dados

```bash
npx prisma generate   # gera o cliente do Prisma
npx prisma db push    # cria as tabelas a partir do schema
```

### 4. Arrancar

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Autor

**Cleyton Tembe** — [GitHub](https://github.com/Cleyton-Tembe)
