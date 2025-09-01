Description of methods

--------------------------------------
lorem: {
--------------------------------------
--------------------------------------
 words
--------------------------------------
    string (words): Fisher-Yates shuffle
    number (Min, Max): Math.random()

    Default value for - super-maker-storage.json: "key: 'words'".
    Сan reassign, for example: "key: 'customWords'"
    --------------
    Usage:
    superMaker.lorem.words()
    or
    superMaker.lorem.words({key: 'customWords'})

    Returns:
    astronae	
--------------------------------------
/words
--------------------------------------

--------------------------------------
sentences
--------------------------------------
    ----------
    string (words, hashtags): Fisher-Yates shuffle
    number (Min, Max): Math.random()

    Number of 'wordMin, wordMax' and 'hashtagMin, hashtagMax', counted separately.

    By default all number values are equal to - '0'.

    Default value for - super-maker-storage.json: "key: 'words'", "key: 'hashtags'".
    Сan reassign, for example: "wordsKey: 'customWords'", "hashtagsKey: 'customHashtags'"

    All values are optional, you can call superMaker.lorem.sentences() and it will return 'null', no error, and the database will have an empty string.
    ----------
	
	Usage:
    superMaker.lorem.sentences({
            sentenceMin: 3,
            sentenceMax: 6,
            wordMin: 5,
            wordMax: 3,
            hashtagMin: 1,
            hashtagMax: 2,

            ----
            custom 
            ----
            wordsKey: 'customWords',
            hashtagsKey: 'customHashtags',
        }),
		
     Returns:
     Lunara #Makemake zenthul eltheon vireon. Quarnex kalyra #Moon stelmara thalor #Jupiter. Velmari #Uranus #Haumea dravion velmari astronae. Virella lurexis nexura #Oberon nexura.
	
--------------------------------------
/sentences	
--------------------------------------

--------------------------------------
fullText
--------------------------------------
    Number of 'wordMin, wordMax' and 'hashtagMin, hashtagMax', counted separately.
    
    By default: "key: 'words'", "key: 'hashtags'"
    Сan reassign, for example: "wordsKey: 'customWords'", "hashtagsKey: 'customHashtags'"

    All values are optional, you can call - 'superMaker.lorem.fullText.generate()' and it will return null, no error, and the database will have an empty string.
 
    ----------
    Usage:
    export async function generatingData({ createdAt, updatedAt }) {
    const {
        title,
        text,
        hashtagsFromFullText
    } = superMaker.lorem.fullText.generate({

        titleOptions: {
            sentenceMin: 0,
            sentenceMax: 3,
            wordMin: 5,
            wordMax: 12,
            hashtagMin: 2,
            hashtagMax: 2

            ----
            custom 
            ----
            wordsKey: 'customWords',
            hashtagsKey: 'customHashtags',
        },

        textOptions: {
            sentenceMin: 1,
            sentenceMax: 8,
            wordMin: 5,
            wordMax: 12,
            hashtagMin: 1,
            hashtagMax: 5

            ----
            custom 
            ----
            wordsKey: 'customWords',
            hashtagsKey: 'customHashtags',
        }
    });

    return {
    title,
    text,
    hashtags: hashtagsFromFullText,
    ....
    };
    }
    Returns:  
    title: #Leda astronae #Oberon ximora nuvion dravion skavari solvenar nuvion gralith. Mirthos virella yxelan draxil eltheon #Neptune #Mars.
    text: Draxil zorvian orleth quarnex #Oberon cryonex nexura ximora #Makemake #Jupiter. Vireon gralith zephirion stelmara vorthal yxelan #Leda #Jupiter quarnex tarnyx. Stelmara #Makemake #Venus zenthul nexura zenthul tarnyx stelmara. Eltheon zenthul zorvian nexura lunara quarnex #Carme stelmara #Elara #Mars astronae.
    hashtags:Array (9)("#leda", "#oberon", "#neptune", "#mars", "#makemake", "#jupiter", "#venus", "#carme", "#elara")
	
--------------------------------------
/fullText	
--------------------------------------
/lorem: {
--------------------------------------


--------------------------------------
take: {
--------------------------------------
--------------------------------------
value	
--------------------------------------

Usage 1: 
    export async function generatingData({ createdAt, updatedAt }) {
    const user = superMaker.take.value({
            key: 'users',
            fromEnd: true
        });
    return {
    user: new ObjectId(user)
        };
    }
     Returns:
    ObjectId('683a6220c57fe3aba56e3745')
    ---
    Usage 2: 
    mainImageUri: superMaker.take.value({
                key: 'images.avatar'
            }),
    Returns:        
    https://raw.githubusercontent.com/AndrewShedov/superMaker/refs/heads/main/storage/images/3.webp
	
--------------------------------------
/value	
--------------------------------------

--------------------------------------
values	
--------------------------------------

Default values:

duplicate: false

When duplicate: true, the fisherYatesShuffle function is not used. Instead, elements are selected using pick, which directly chooses random elements from the array via Math.random(), fisherYatesShuffle is not suitable here because it creates a permutation of the array without repeats.
        
    Usage:
    liked: superMaker.take.values({
                key: 'users',
                duplicate: true,
                min: 3,
                max: 10,
                reverse: true
            }),
    Returns:
    liked: Array (6)(
    "683a6220c57fe3aba56e3745",
    "683a62204094be10d6f90378",
    "683a62208ec63ed29e9a0137",
    "683a6251661f8f39765a75cc",
    "683a62208355f4708ed7ed81",
    "683a6220941ebd4340a2e226"
    )
	
--------------------------------------
/values	
--------------------------------------
/take: {
--------------------------------------

--------------------------------------
randomNumber 
--------------------------------------

Usage:
  superMaker.randomNumber();
  Returns:
  0...Number.MAX_SAFE_INTEGER
  ---
  superMaker.randomNumber({ max: 500 });
  0...500
  ---
  superMaker.randomNumber({ min: 500 });
  500...Number.MAX_SAFE_INTEGER
  ---
  superMaker.randomNumber({ min: 100, max: 500 });
  100...500
  ---
  superMaker.randomNumber({ min: 500, max: 100 });
  100...500 (swap)
  ---
  randomNumber({ max: -50, min: -1000 })
  -483
  ---
  superMaker.randomNumber({ min: 5, max: 7, float: true });
  for example 5.2342531
  ---
  superMaker.randomNumber({ float: true });
  random number between 0 and Number.MAX_SAFE_INTEGER (floating point)
  ---
  superMaker.randomNumber({ float: true }).toFixed(2)
  2858776836282319.50
  
--------------------------------------
/randomNumber 
--------------------------------------
  
  
--------------------------------------
 randomDate 
--------------------------------------
  Usage:
  date: superMaker.randomDate({
       min: { year: 2005, month: 2, day: 28, hour: 5, minute: 1, second: 1, ms: 1 },
       max: { year: 2010, month: 7, day: 21, hour: 5, minute: 1, second: 1, ms: 1 }
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate({
       min: { year: 2005},
       max: { year: 2010}
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate({
      max: { year: 2010}
    }),
  Returns:
  2007-04-27T01:32:19.181+00:00
  ---
  Usage:
  date: superMaker.randomDate(),
  Returns:
  1990-04-27T01:32:19.181+00:00
  
--------------------------------------
 /randomDate 
--------------------------------------


---------------------------------------  
 randomBoolean
---------------------------------------

superMaker.randomBoolean();
  50% true / 50 % false

  superMaker.randomBoolean(0.7);
  70% true / 30 % false

  superMaker.randomBoolean(0.1);
  10% true / 90 % false

---------------------------------------  
 /randomBoolean
---------------------------------------


---------------------------------------  
 randomCrypto
---------------------------------------

Usage:
customId: superMaker.randomCrypto(16)

Returns:
19ed1bd590cbdf368c4ad8823f5cf25b

---------------------------------------  
 /randomCrypto
---------------------------------------


---------------------------------------  
randomEmailCrypto
---------------------------------------
Usage:
email: superMaker.randomEmailCrypto(5)

Returns:
06e675b854@gmail.com

---------------------------------------  
/randomEmailCrypto
---------------------------------------




  