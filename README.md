# justify-api

A REST API that justifies text to a line width of 80 characters, with token-based authentication and per-token rate limiting.

**Live URL:** `https://api.lhuillierleo.com`

---

## Features

- Text justification to exactly 80 characters per line, implemented from scratch
- Token-based authentication via email
- Rate limiting of 80,000 words per day per token
- Persistent storage with Redis

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Storage:** Redis
- **Testing:** Jest + Supertest
- **Deployment:** Railway

---

## Project Structure

```
src/
├── index.ts              # Entry point, Express app setup
├── middleware/
│   └── auth.ts           # Token authentication middleware
├── routes/
│   ├── token.ts          # POST /api/token
│   └── justify.ts        # POST /api/justify
└── services/
    ├── justify.ts        # Text justification algorithm
    └── redis.ts          # Redis client
tests/
├── justify.test.ts       # Unit tests for the justify algorithm
├── token.test.ts         # Integration tests for /api/token
├── api.test.ts           # Integration tests for /api/justify
└── mocks/
    └── redis.ts          # Redis mock for tests
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Redis

### Installation

```bash
git clone git@github.com:leo-l-huillier/justify-api.git
cd justify-api
npm install
```

### Environment Variables

Create a `.env` file at the root:

```
PORT=3000
REDIS_URL=redis://localhost:6379
```

### Run in development

```bash
npm run dev
```

### Build and run in production

```bash
npm run build
npm start
```

---

## API Reference

### `POST /api/token`

Generates an authentication token for a given email address.

**Request**
```
Content-Type: application/json

{
  "email": "foo@bar.com"
}
```

**Response `200`**
```json
{
  "token": "a3f1c2d4-..."
}
```

**Response `400`** — missing or invalid email
```json
{
  "error": "A valid email is required"
}
```

---

### `POST /api/justify`

Justifies a plain text body to 80 characters per line.

**Request**
```
Content-Type: text/plain
Authorization: Bearer <token>

`Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. 

Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. 
 Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.`
```

**Response `200`**
```
Content-Type: text/plain

Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,
mes  yeux  se  fermaient  si  vite  que  je n’avais pas le temps de me dire: «Je
m’endors.»  Et, une demi-heure après, la pensée qu’il était temps de chercher le
sommeil  m’éveillait;  je  voulais poser le volume que je croyais avoir dans les
mains  et  souffler  ma  lumière;  je  n’avais pas cessé en dormant de faire des
réflexions  sur  ce  que  je venais de lire, mais ces réflexions avaient pris un
tour  un  peu  particulier;  il me semblait que j’étais moi-même ce dont parlait
l’ouvrage:   une  église,  un  quatuor,  la  rivalité  de  François  Ier  et  de
Charles-Quint.                                                                  

Cette  croyance  survivait  pendant  quelques  secondes  à  mon  réveil; elle ne
choquait  pas  ma  raison,  mais  pesait  comme des écailles sur mes yeux et les
empêchait  de  se  rendre  compte que le bougeoir n’était plus allumé. Puis elle
commençait  à me devenir inintelligible, comme après la métempsycose les pensées
d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre
de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de
trouver  autour  de  moi  une  obscurité, douce et reposante pour mes yeux, mais
peut-être  plus  encore pour mon esprit, à qui elle apparaissait comme une chose
sans  cause, incompréhensible, comme une chose vraiment obscure. Je me demandais
quelle  heure il pouvait être; j’entendais le sifflement des trains qui, plus ou
moins  éloigné,  comme  le  chant  d’un  oiseau  dans  une  forêt,  relevant les
distances,  me décrivait l’étendue de la campagne déserte où le voyageur se hâte
vers  la station prochaine; et le petit chemin qu’il suit va être gravé dans son
souvenir  par  l’excitation  qu’il  doit  à  des  lieux  nouveaux,  à  des actes
inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le
suivent encore dans le silence de la nuit, à la douceur prochaine du retour.
```

**Response `401`** — missing or invalid token
```json
{
  "error": "Missing Authorization header"
}
```

**Response `402`** — daily word limit exceeded
```json
{
  "error": "Daily word limit exceeded"
}
```

---

## Rate Limiting

Each token is limited to **80,000 words per day**. The counter resets every 24 hours. Exceeding the limit returns a `402 Payment Required` error.

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

### Coverage

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| `src/index.ts` | 100% | 100% | 100% | 100% |
| `src/middleware/auth.ts` | 100% | 100% | 100% | 100% |
| `src/routes/justify.ts` | 100% | 100% | 100% | 100% |
| `src/routes/token.ts` | 100% | 100% | 100% | 100% |
| `src/services/justify.ts` | 100% | 100% | 100% | 100% |

---
## Justification Algorithm

The justification algorithm is implemented from scratch in `src/services/justify.ts` with no external libraries, and is split into two functions.

---

### `justifyText(text, lineWidth)`

The main function. It handles the full pipeline from raw text to justified output.

**1. Paragraph splitting**
The input text is split on two or more consecutive newlines (`\n\n+`), preserving paragraph breaks. Empty paragraphs are ignored.

**2. Single newlines as spaces**
Within a paragraph, single newlines are treated as spaces — the paragraph is flattened into a stream of words.

**3. Line packing**
Words are greedily packed into lines. A word is added to the current line as long as:
```
charCount + numberOfSpaces + word.length <= lineWidth
```
When a word no longer fits, the current line is saved and a new one starts.

**4. Per-line justification**
Each line is passed to `justifyLine`. The last line of each paragraph is left-aligned; all other lines are fully justified.

**5. Output**
Lines within a paragraph are joined with `\n`. Paragraphs are joined with `\n\n`.

---

### `justifyLine(words, lineWidth, lastLine)`

Justifies a single line of words to exactly `lineWidth` characters.

**Left-aligned lines** (last line of a paragraph, or single word):
```
words.join(" ") + trailing spaces
```

**Justified lines:**
```
totalSpaces = lineWidth - sum of word lengths
gapsNumber  = words.length - 1
baseSpaces  = Math.floor(totalSpaces / gapsNumber)
extraSpaces = totalSpaces % gapsNumber
```
The first `extraSpaces` gaps get `baseSpaces + 1` spaces, the rest get `baseSpaces`. This ensures spaces are distributed as evenly as possible, with extra spaces going to the leftmost gaps first.

**Example** with `lineWidth = 20`:
```
words = ["foo", "bar", "baz", "qux"]

totalSpaces = 20 - 12 = 8
gapsNumber  = 3
baseSpaces  = 2
extraSpaces = 2

gap 0 → 3 spaces  (2 + 1, car 0 < 2)
gap 1 → 3 spaces  (2 + 1, car 1 < 2)
gap 2 → 2 spaces  (2 + 0, car 2 >= 2)

result → "foo   bar   baz  qux"  ✅ (20 chars)

```

---


**Example**

Input:
```
curl -X POST https://api.lhuillierleo.com/api/token \  
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'
```
Output:
```
{"token":"fda4d167-9a34-43e5-b7fc-fefc412b8a5b"}
```
Input:
```
curl -X POST https://api.lhuillierleo.com/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer fda4d167-9a34-43e5-b7fc-fefc412b8a5b" \
  -d 'The sky above the port was the color of television tuned to a dead channel. It was a bright cold 
  day in April and the clocks were striking thirteen.The quick brown fox jumps over the 
  lazy dog and then just walked away slowly.'
```
Output:
```
The  sky  above the port was the color of television tuned to a dead channel. It
was  a  bright cold day in April and the clocks were striking thirteen.The quick
brown fox jumps over the lazy dog and then just walked away slowly.
```