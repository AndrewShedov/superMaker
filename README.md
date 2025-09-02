[![Discord](https://img.shields.io/discord/1006372235172384849?style=for-the-badge&logo=5865F2&logoColor=black&labelColor=black&color=%23f3f3f3
)](https://discord.gg/ENB7RbxVZE)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=5865F2&logoColor=black&labelColor=black&color=%23f3f3f3)](https://github.com/AndrewShedov/mongoCollector/blob/main/LICENSE)

# superMaker
Data generator designed specifically for [turboMaker](https://www.npmjs.com/package/turbo-maker). Uses **Fisher-Yates shuffle**.<br>
It allows you to generate <code>random</code> <code>texts</code>, <code>hashtags</code>, <code>words</code>, <code>full names</code>, <code>emails</code>, <code>url links</code>, and much more.

### Ideal for

- Populating databases and creating fake content (<code>posts</code>, <code>users</code>, <code>products</code>, etc.)
- Rapid prototyping

### Features

1. Ability to create a fully custom data storage to be used during generation.
2. Uses **Uses Fisher-Yates shuffle** - a reliable shuffling algorithm.
3. Text generation with hashtags.
4. Automatic hashtag extraction.
5. Generation of <code>unique</code> <code>email</code>, <code>ID</code>, etc., using <code>randomBytes()</code>.
6. Generation of <code>random links</code> (for example, for displaying images).
7. Work with <code>arrays</code> and <code>objects</code>.

### Installation & Usage

1. Install the package:

```js
npm i super-maker
```
2. In the root of the project, create a file [super-maker-storage.json](https://github.com/AndrewShedov/superMaker/blob/main/storage/super-maker-storage.json).

Fill it with data, for example:

```json
{
  "words": [
    "zorvian",
    "velthara",
    "quarnex"
  ],
  "hashtags": [
    "#Mercury",
    "#Venus",
    "#Moon"
  ],
  "fullName": [
    "James Smith",
    "John Johnson",
    "Robert Brown"
  ],
  "fullNames": {
    "name": [
      "James",
      "Emily",
      "Michael"
    ],
    "surname": [
      "Smith",
      "Johnson",
      "Williams"
    ]
  },
  "images": {
    "avatar": [
      "https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/1.webp",
      "https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/2.webp"
    ],
    "banner": [
      "https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/1.webp",
      "https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/2.webp"
    ]
  },
  "users": [
    "683a6251661f8f39765a75cc",
    "683a6220c57fe3aba56e3745",
    "683a622042fd1cb967541fb5",
    "683a62208355f4708ed7ed81"
  ]
}
```

3. Generate data in [turboMaker](https://www.npmjs.com/package/turbo-maker).

**Example**: posts generation:

```js
import { superMaker } from 'super-maker';
import { ObjectId } from 'mongodb';

export const config = {
    uri: 'mongodb://127.0.0.1:27017',
    db: 'crystalTest',
    collection: 'posts',
    numberThreads: 'max',
    numberDocuments: 1_000_000,
    batchSize: 10_000,
    timeStepMs: 20
};

export async function generatingData({
    createdAt,
    updatedAt
}) {

    const user = superMaker.take.value({
        key: 'users'
    });

    const {
        title,
        text,
        hashtagsFromFullText
    } = superMaker.lorem.fullText.generate({

        titleOptions: {
            sentenceMin: 0,
            sentenceMax: 1,
            wordMin: 4,
            wordMax: 7,
            hashtagMin: 0,
            hashtagMax: 1
        },

        textOptions: {
            sentenceMin: 1,
            sentenceMax: 12,
            wordMin: 4,
            wordMax: 10,
            hashtagMin: 0,
            hashtagMax: 2
        }
    });

    return {

        title,
        text,
        hashtags: hashtagsFromFullText,

        views: superMaker.randomNumber({
            min: 120,
            max: 3125
        }),

        mainImage: superMaker.take.value({
            key: 'images.avatar'
        }),

        liked: superMaker.take.values({
            key: 'users',
            min: 3,
            max: 25
        }),

        user: new ObjectId(user),
        createdAt,
        updatedAt
    };
}
```
[Examples of generations](https://github.com/AndrewShedov/turboMaker/tree/main/config%20examples)

### Available methods

```js
lorem: {
    words,
    sentences,
    fullText
  },
```

 **words**

 Takes words from the storage and outputs them in random order, uses - **Fisher-Yates shuffle**.

 **sentences**

 Takes words from the storage and turns them into sentences with or without hashtags and outputs them in random order, uses - **Fisher-Yates shuffle**.

 **fullText**

 Takes words from the storage and turns them into sentences with or without hashtags and outputs them randomly, uses - **Fisher-Yates shuffle**. You can     split the sentence into parts: title, text, hashtagsFromFullText and output each part in a separate document field.
 
 ```js
 take: {
    value,
    values
  },
 ```

**value**

Returns a single value from storage, by key.

**values**

Outputs an array of values from storage, by key.

```js
randomNumber,
randomDate,
randomBoolean,
randomCrypto,
randomEmailCrypto
```

**randomNumber**

Outputs a random number.

**randomDate**

Outputs a random date.
Time format - 24 hour.

**randomBoolean**

Outputs a random boolean.

**randomCrypto**

Outputs generated cryptographically strong pseudo-random data with the given length <code>superMaker.randomCrypto(16)</code>. Uses - <code>randomBytes()</code>.

**randomEmailCrypto**

Outputs generated cryptographically strong pseudo-random data with a given length <code>superMaker.randomEmailCrypto(5)</code> and frames it in '06e675b854@gmail.com'. Uses - <code>randomBytes()</code>.

[Full description of methods](https://github.com/AndrewShedov/superMaker/blob/main/documentation/Description%20of%20methods.txt)

The video shows a simulation of [CRYSTAL v2.0](https://shedov.top/about-the-crystal-project/) in operation, using fake data generated with turboMaker and superMaker: <br>

<p align="center">
<a href="https://youtu.be/5V4otU4KZaA?t=2">
  <img src="https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/assets/screenshot_1.png" style="width: 100%; max-width: 100%;" alt="CRYSTAL v1.0 features"/>
</a>
</p>

[SHEDOV.TOP](https://shedov.top/) | [CRYSTAL](https://crysty.ru/AndrewShedov) | [Discord](https://discord.gg/ENB7RbxVZE) | [Telegram](https://t.me/ShedovChannel) | [X](https://x.com/AndrewShedov) | [VK](https://vk.com/shedovclub) | [VK Video](https://vkvideo.ru/@shedovclub) | [YouTube](https://www.youtube.com/@AndrewShedov)
