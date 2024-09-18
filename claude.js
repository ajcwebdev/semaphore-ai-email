// claude.js

import Anthropic from '@anthropic-ai/sdk'
import { ARTICLE_1 } from './ARTICLE_1.js'
import { ARTICLE_2 } from './ARTICLE_2.js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

async function summarizeArticle(article) {
  const prompt = `Please provide a one to two paragraph summary of the following article:

${article}

Summary:`

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 300,
    messages: [
      { role: "user", content: prompt }
    ]
  })
  return response.content[0].text
}

async function processArticles(articles) {
  const summaries = []
  for (const article of articles) {
    const { title, content } = article
    const summary = await summarizeArticle(content)
    summaries.push({
      title,
      summary
    })
    console.log(`Summarized: ${title}`)
  }
  return summaries
}

async function main() {
  const articles = [
    {
        title: ARTICLE_1.title,
        content: ARTICLE_1.content
      },
      {
        title: ARTICLE_2.title,
        content: ARTICLE_2.content
      }
  ]
  try {
    const results = await processArticles(articles)
    for (const result of results) {
      console.log(`\nTitle: ${result.title}`)
      console.log(`Summary: ${result.summary}`)
      console.log("-".repeat(50))
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

main()