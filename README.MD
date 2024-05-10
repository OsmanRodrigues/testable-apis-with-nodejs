#  Testable APIs with Node.js - Study repo

## Summary

In this repo you will find the final code based in the knowledgemnt and the step-by-step coding process shared in the [book "Construindo APIs testáveis com Nodejs"](https://github.com/waldemarnt/building-testable-apis-with-nodejs) by @waldemarnt. This book introduces us some good practices (the bests to must have, I think) to start an scalable app using Node.js.

## Good practices for scalable apps

Good practices for scalable apps are agnostic foundations, approaches and implementations, shared widely by the software engineering community in order to promote a sustainable and productive (and profitable, consequently) way to build software. 

Among the good pratices mentioned in the book are:

- **Deep understanding and domain of a programming language and related technologies**, demonstrated through the introductory chapters with historical context of the JavaScript, the Node.js and their related community and derived technologies (like as Express.js);
- **Test Driven Development - TDD**, that is a software development approach where tests are written before the actual code (for me, the best practice to write unit tests);
- **Behavior Driven Development - BDD**, that is a Agile approach to software testing where testers write test cases in simple language that even people without technical expertise can understand, using "GivenWhenThen" statements strategy (for me, the best practice to write tests in general);
- **Modularization decisions**, using the ModelViewController - MVC, one of the most popular architectural pattern, and SOLID principles;
- **Design Patterns**, that are typical solutions to common problems in software development. Singleton and Middleware (Chain of Responsibility) are the most covered in this book;
- **Graceful shutdown**, that is a secure way to handle application's errors, especially in containerization context (Docker, Kubernetes). In this book it is approached in how Node.js do this work in a simple and elegant way.
- **Code style**, and how is important to have a standardized way to write code, comments, commits and pull requests, in order to allow a nice code review process.

## How this repo can help you?

You can use this repo as an auxiliar source to consult in a concrete way the concepts and implementations covered in that book.

I suggest you this way of study:

1. Read the introductory chapters (from "Introdução ao Node.js" to "Iniciando o projeto");
2. From the chapter "Desenvolvimento guiado por testes", try to implements the code suggested yourself, if you got stuck, follow the commit history of this repo in parallel (from oldest to newest).

Keep in mind that this repo is based in the related book and have some adjusts and updates made. 

## Extra commands

- Use MongoDB with Docker
  - Up and build container:
  ```
  npm run db:dev:up
  ```
  - Down container:
  ```
  npm run db:dev:down
  ```

- Use the version 20 of Node.js (with nvm)
```
nvm use
```