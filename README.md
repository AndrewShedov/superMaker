[![Discord](https://img.shields.io/discord/1006372235172384849?style=for-the-badge&logo=discord&logoColor=white&labelColor=black&color=%23f3f3f3&label=)](https://discord.gg/ENB7RbxVZE)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&logo=5865F2&logoColor=black&labelColor=black&color=%23f3f3f3)](https://github.com/AndrewShedov/superMaker/blob/main/LICENSE)

# superMaker
Data generator designed specifically for [turboMaker](https://www.npmjs.com/package/turbo-maker).<br>
Generates random data: <code>text</code>, <code>hashtags</code>, <code>words</code>, <code>dates</code>, <code>emails</code>, <code>id</code>, <code>url</code>, <code>arrays</code>, <code>booleans</code>, etc.

### Suitable for

- Populating databases and creating synthetic content (<code>posts</code>, <code>users</code>, <code>products</code>, etc.)
- Rapid prototyping

### Features

1. Ability to create a fully custom data storage to be used during generation.
2. Uses **Fisher-Yates shuffle** - a reliable shuffling algorithm.
3. Text generation with hashtags.
4. Automatic hashtag extraction.
5. Generation of unique <code>email</code>, <code>id</code>, etc., using <code>randomBytes()</code>.
6. Work with <code>arrays</code> and <code>objects</code>.

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

 Takes words from the store and turns them into sentences with or without hashtags and outputs them randomly, uses **Fisher-Yates shuffle**. You can specify different output variations.

 **fullText**

Extracts words from the storage, converts them into sentences with or without hashtags, and outputs them randomly using the **Fisher-Yates shuffle**. You can split a sentence into parts: <code>title</code>, <code>text</code>, <code>hashtagsFromFullText</code> and output each part in a separate document field, as well as specify different output variations.

 ```js
 take: {
    value,
    values
  },
 ```

**value**

Returns a single value from storage, by key.

**values**

Outputs an array of values from storage by key, with various variations and output settings.

```js
randomNumber,
randomDate,
randomBoolean,
randomCrypto,
randomEmailCrypto
```

**randomNumber**

Outputs a random number in a configurable range.

**randomDate**

Displays a random date within a configurable range.<br>
Time format - 24 hour.

**randomBoolean**

Outputs a random boolean within a configurable percentage range.

**randomCrypto**

Outputs generated cryptographically strong pseudo-random data with the given length <code>superMaker.randomCrypto(16)</code>. Uses - <code>randomBytes()</code>.

**randomEmailCrypto**

Outputs generated cryptographically strong pseudo-random data with a given length <code>superMaker.randomEmailCrypto(5)</code> and frames it in '06e675b854@gmail.com'. Uses - <code>randomBytes()</code>.

[Full description of methods](https://github.com/AndrewShedov/superMaker/blob/main/docs/description%20of%20methods.txt)


Simulation of [CRYSTAL v2.0](https://shedov.top/about-the-crystal-project/) operation using synthetic data generated with turboMaker and superMaker:<br>

<p align="center">
<a href="https://youtu.be/5V4otU4KZaA?t=2">
  <img src="https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/assets/screenshot_1.png" style="width: 100%; max-width: 100%;" alt="CRYSTAL v1.0 features"/>
</a>
</p>

[![SHEDOV.TOP](https://img.shields.io/badge/SHEDOV.TOP-black?style=for-the-badge)](https://shedov.top/) 
[![CRYSTAL](https://img.shields.io/badge/CRYSTAL-black?style=for-the-badge)](https://crysty.ru/AndrewShedov)
[![Discord](https://img.shields.io/badge/Discord-black?style=for-the-badge&logo=discord&color=black&logoColor=white)](https://discord.gg/ENB7RbxVZE)
[![Telegram](https://img.shields.io/badge/Telegram-black?style=for-the-badge&logo=telegram&color=black&logoColor=white)](https://t.me/ShedovChannel)
[![X](https://img.shields.io/badge/%20-black?style=for-the-badge&logo=x&logoColor=white)](https://x.com/AndrewShedov)
[![VK](https://img.shields.io/badge/VK-black?style=for-the-badge&logo=vk)](https://vk.com/shedovchannel)
[![VK Video](https://img.shields.io/badge/VK%20Video-black?style=for-the-badge&logo=vk)](https://vkvideo.ru/@shedovchannel)
[![YouTube](https://img.shields.io/badge/YouTube-black?style=for-the-badge&logo=youtube)](https://www.youtube.com/@AndrewShedov)
