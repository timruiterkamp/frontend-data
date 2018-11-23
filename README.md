# Frontend data - University of Applied Sciences Amsterdam

In this project I will research the possibilities of how I can make meaningful interactions to give better insight in the debt of European countries.


The product can be found here: [https://frontend-data.netlify.com](https://frontend-data.netlify.com)

## Table of contents

* [Installation of the project](#Installation-of-the-project)  
* [Possible interactive solutions](#possible-interactive-research-cases-️)  
    * [OBA related](#OBA-related)  
    * [Not OBA related](#-Not-OBA-related)  
* [Chosen interactive solutions](#Chosen-interactive-case)  
    * [Subquestions](#subquestions)  
* [Overview research case](#Overview-research-case)  
    * [What is the total debt of countries](#What-is-the-total-debt-of-countries )  
    * [What continent do I choose](#What-continent-do-I-choose )  
    * [How big is the population](#How-big-is-the-population )  
    * [What are famous dishes / products per country](#What-are-famous-dishes-/-products-per-country )  
    * [Display the values](#Display-the-values)  
    * [How big is the debt per person](#How-big-is-the-debt-per-person)  
* [Sketching journey](#Sketching-journey-️)  
* [Outcome after all the filtering](#Outcome-after-all-the-filtering-)  
* [Result](#endresult-)  
* [Todo](#Yet-TODO)  
* [Conclusion](#Conclusion)  
* [Techniques used](#Techniques-used)  
* [Code description](#Code-description) 
* [Honorable mentions](#Honorable-mentions) 
* [Sources](#Sources)  




## Installation of the project 

```bash
git clone https://github.com/timruiterkamp/frontend-data.git  
cd frontend-data  
npm install  
npm run dev  
```

# Possible interactive research cases 🕵️
## OBA related
* Show the amount of books, divided in cheap, medium, expensive and mixed, that are needed to retrieve the subscription value. 
* Filter by different genres (they need to retrieved from the scraper)   
* Show the amount of pages a book contains in opposite of other books with the same price range 
* Range slider to adjust the price range of books  
* How many books do you need to reach county debts 
* How many books do you need to travel 1 time around the world and what would this cost?
* How many books about military can you buy with the total expense of arms (per continent)

## Not OBA related
* Give insight in the total debt of a country / region / continent.
* How many products do you need to buy/sell to pay off your countries debt.
  
# Chosen interactive case
Combined all not OBA related cases which resulted in the research case:  
- Give insight in the total debt of a country and how many debt this is per person.
    - How many of a famous product in a country do you need to sell to pay off the debt
  

## subquestions
* What are famous dishes / products per country
* What is the total debt of countries
* What continent do I choose
* How big is the population
* How big is the debt per person
* How to show the debt properly
  
# Overview research case

## What is the total debt of countries  
To research this is searched multiple government websites to get a somewhat complete dataset of countries and their debt.
Eventually I found a government file where there was data from 2014 till 2017. However only 2016 and 2017 got complete debt data. But it was usefull for my products as I did not require more than one or two years of data to make my product work.
The csv was build as following: 
```CSV
"TIME","GEO","NA_ITEM","SECTOR","MATURITY","UNIT","Value","Flag and Footnotes"

"2017","Sweden","Government consolidated gross debt","Total economy and rest of the world","Total - all maturities","Million euro","50,496.3",""
```
This is somewhat confusing and not very usefull to work with in Javascript. So with D3 I used the `D3.csv()` function to compile my data to an Array of objects. As this is what `D3.csv()` does in the core of the function.  
To give an insight in what the function would do, this was the results after running the function:
```JS
    {
        Flag and Footnotes: "",
        GEO: "Sweden",
        MATURITY: "Total - all maturities",
        NA_ITEM: "Government consolidated gross debt",
        SECTOR: "Total economy and rest of the world",
        TIME: "2017",
        UNIT: "Million euro",
        Value: "50,496.3",
    }
```
Waaay more readable and useful right? That's what I thougt!
So we got our debt per country right now, but I am still missing essential data as how do I show it and comparison data.

## What continent do I choose
So after getting the debt from some countries I reconized most of my data came from Europe. Despite getting this data, Europe was also quite good to gather data from and there is a rich variety of debts, populations, country sizes and habits. Perfect continent to start on, in the future I could always step my game up and move on to multiple continents.
   
## How big is the population
So we decided to work with European countries and debts. Now I just need some comparison materials, for example a population number per country.  
Step 1 in this section is look for data about populations. So I reached out to the same European government database where a lot of European data is available, and without any hard times I found my needed dataset. This again was a `.csv` file so I had to, once again, get my good friend `d3.csv` to do the hard work. After running the function the data looked like this:  

```JS
    {
    1960: "SP.POP.TOTL"
    1961: "4068095"
    1962: "4191667"
    1963: "4238188"
    1964: "4282017"
    1965: "4327341"
    1966: "4370983"
    1967: "4411666"
    1968: "4449367"
    1969: "4483915"
    1970: "4518607"
    1971: "4538223"
    1972: "4557449"
    1973: "4596622"
    1974: "4641445"
    1975: "4689623"
    1976: "4739105"
    1977: "4789507"
    1978: "4840501"
    1979: "4890125"
    1980: "4938973"
    1981: "4979815"
    1982: "5016105"
    1983: "5055099"
    1984: "5091971"
    1985: "5127097"
    1986: "5161768"
    1987: "5193838"
    1988: "5222840"
    1989: "5250596"
    1990: "5275942"
    1991: "5299187"
    1992: "5303294"
    1993: "5305016"
    1994: "5325305"
    1995: "5346331"
    1996: "5361999"
    1997: "5373361"
    1998: "5383291"
    1999: "5390516"
    2000: "5396020"
    2001: "5388720"
    2002: "5378867"
    2003: "5376912"
    2004: "5373374"
    2005: "5372280"
    2006: "5372807"
    2007: "5373054"
    2008: "5374622"
    2009: "5379233"
    2010: "5386406"
    2011: "5391428"
    2012: "5398384"
    2013: "5407579"
    2014: "5413393"
    2015: "5418649"
    2016: "5424050"
    Country Code: "SVK"
    Country Name: "Slovak Republic"
    Indicator Code: " total"
    Indicator Name: "Population"
}
```
The data contained insight in the population numbers between 1961 and 2016. At the start of the project I just used the most recent population number. In the near future I could use the increase in population to compare to the debt increase/decrease.


## What are famous dishes / products per country
To answer this me and my girlfriend searched the web, mostly cookbooks en restaurant reviews to gain insight in famous dishes / products and their prices. It was quite difficult to find all the prices as some dishes are a combination of multiple food sorts.  In the end I got quite some products and it looked like this in JSON format:

```JSON
[
    { 
        "key": "Slovakia",
        "food": [
            { "name": "Halušky",
                "price": 7.00,
                "amount": 1
            },
            { "name": "Lokše",
                "price": 2.00,
                "amount": 1
            },
            { "name": "Bryndzové pirohy",
                "price": 3.00,
                "amount": 5
            }]
    }
]
```

Unfortunately I did not find the right price by every item so I guessed what a combination of products would cost in a little restaurant. The most expensive products are mostly liquor, with champagn being the most expensive. The complete meals vary from €7 to €22.


## Display the values
Every dataset I found has some sort of indicator to what country it belongs. Since I am working with countries my immediate thoughts were to use a map. So to display the data on a map I would need GEO locations from all countries. Luckily Google had all these data points. 

I found Mapbox, a great library for map display. It's quick ,fun to use and has lots of features. So this was my go to when it came to a choice of map display library. 

The geocodes were also a `.csv` file, when i ran the `d3.csv` function over it, it resulted in a data structure like this:
```JS
{
    country: "SE",
    latitude: "60.128161",
    longitude: "18.643501",
    name: "Sweden"
}
```

The only thing left is to merge this with all the other country data.

To merge the data I used a sequence of `d3.nest()` functions to filter each data file (csv file) to the right output, so I could use it later on.

So for example, I want to only take the total population of countries in 2016, as pre 2016 is not relevant for my current setup of the case. The following code is used to filter just the values from 2016

```Javascript
d3
    .nest()
    .key(d => d['Country Name'])
    .rollup(v => v[0][2016])
    .entries(values[2])
```

This would result in:
```JS
key: "Sweden"
value: "9696110"
```

During this filtering the country name was used to compare and merge data. To watch the full function, you can go to [The actual code](https://github.com/timruiterkamp/frontend-data/blob/158d1452eee787466cc29bba17340f1d9980e280/scripts/stateData.js#L43)

## How big is the debt per person
To calculate the debt per person I used the total debt and divided it by the total population. For the current status of the project this is a great use case. But when I would take more time for this, I would've searched for the total toddlers / kids in a country and exclude them from the total population. Because this share of the population don't really have money and are supervised by their parents.  


# Sketching journey ✏️

So a big step back to the beginning of the project. I was thinking of doing something other than comparing book genres and searched for something with money, countries and a worldmap. Some ideas I sketched out were:  

![Sketching the data](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/sketches.jpg)

The first screen I designed was the overview of the countries.  
![visualizing the data](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/intro-screen.jpg)

The second screen I designed was the in debth situation of the country, where you zoom in on the country  
![showing data per country](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/active-country1.jpg)

The third screen I designed was the overview of the debt per person by displaying what amount of items a person should buy/sell to pay off the debt.  
![Showing ](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/active-country2.jpg)


# Outcome after all the filtering 🕵️‍♂️
   So after all the filtering the clean data looked like this:
   ```js
    country: (...) // number
    debt: (...) // debts 2015 / 2016
    food: (...) // array with food per country
    lat: (...) // lat location
    long: (...) // long location
    population: (...) // number
   ```
   And when displayed on a world map, the lat and long positions would result in:
   ![visualized data](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/data-display.png)

## Outcomes along the way 🚀
  - France has a very big debt of 2 trillion euro's. It's the biggest debt in whole of europe as of 2017.  
  - Relatively Norway has the largest debt per person of €102.000.   
  - Despite france having the largest debt, when you look at what it would cost per person the are just in the higher middle of all countries with a total of €30.000 per person.  
  - Norway has a decreasing debt over the last year it lowered with 14 billion euro.  
    - This results in that people just have to buy 33.264 Kjøttkaker instead of 34.156.  

## Endresult 📊
  At the end of the two weeks I've been working on this project and the result came quite close to my first thoughts about the look and feel this product should have. I tried to stimulate exploring without too many steps in between.  
  To make this product easier to use, I created a small introduction screen with instruction you can follow, these instruction contain information on what the project is about and how to navigate through the data.
  ![final product introduction](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/finalproduct-intro.png)

  To create a nice flow through the product I defined some basic filters and ways to travel around in the beginning of the screen. In this way, without really requiring interaction the user can see some of the results from the data. I thought this was some important usage requirement because you don't want to force the user to spit through all the options. So I created a way to random go somewhere, filter on different aspects of the data and finding your own country by navigating or clicking on the country name in the dropdown list.
  ![final product introduction](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/finalproduct-overview.png)

  The next thing that I wanted to do was creating some interesting data comparison. So I found some popular dishes from the countries and used it to compare it to the total debt of the country. In this way you see how (sometimes absurd) amounts of a product you would need per person to pay off the debt and find out what dishes are popular within a country.
   ![final product chart](https://github.com/timruiterkamp/frontend-data/blob/master/gh-images/finalproduct-chart.png)

## Conclusion
When I look back at this project, I am very glad I got the opportunity to use an other dataset than the OBA dataset. I enjoyed looking up my own data and trying out datasets and combining useful data together. Some things took a bit longer than expected as getting the right data structure. Looking back at my last project [Functional programming](https://github.com/timruiterkamp/functional-programming) I told myself to think way better of data structures, so I did try to build it with more thought. But still during the process I reconized that data is continuously changing the way the data should look. I have helped quite alot of people during these two weeks and I think that those hours could result in more efficient and clean code and a better user interface. But helping others is always good, so I have no regrets and I'm mostly glad I finished my project and helped as much as I could.
    
A quick look back at difficulties I experienced, I think the D3 part of generating charts and update them the way I did was somewhat difficult and took some time. The problem I faced was that my trigger was a click on a object outside D3 (an svg generated on mapbox) and that resulted in that every click would generate a new chart on top of the previous chart. A check that would watch if the chart has been drawn fixed it eventually with some code tweekings.

The past 6 weeks have been intensive when it comes to code due to the 3 different projects. But it were really good excercises and I can tell I'm way more comfortable trying things out and understanding how many aspects of javascript work and what they do. Also my D3 knowledge has improved a lot over the past weeks, I will definitely checkout other data analyzing libraries as chartJS and look at what the most remarkable differences are. In my opinion D3 is very powerful and has really great benefits but I'm still curious if it's efficient for smaller projects compared to something like chartJS.

## Presentation D3.nest()
During these last two weeks I've had the opportunity to share my knowledge with my co-students about `D3.nest()`. The presentation mostly included examples of how and why you would use it. The feedback I got from other students were very positive and the told me that they understand the functionality way better after the presentation. 

Fun note, after the presentation I shared my code with the students and I reconized they were using it in their own code to try it out and refactor it to their own needs. I thought this was quite fun to see your examples being used for their own project

## Techniques used
  * Mapbox
  * D3
  * Javascript
  * VueJS

## Code description
| Files   |      Description      |
|----------|-------------|
| index.html |  Base of the code where the application is setup|
| ./src/* |  Folder with all the scripts and styling |
| ./src/scripts |  Folder with all the scripts |
| ./src/scripts/index |  The initialize file of the map and charts |
| ./src/scripts/stateData |  The file where the data is being filtered |
| ./src/scripts/vueSetup |  The file where the Vue is being initialized and state is being made |
| ./src/scripts/interactions |  The file where the interactions of the elements take place|
| ./src/styles |  Folder with all the styling |
| ./src/styles/index.css |  Folder with all the styling |
| ./dist/ |  Folder with the compiled code |
| ./dist/index |  Webpack code |
| ./dist/wps-hmr |  Webpack config code |
| ./dist/index.css |  compiled styling |
| ./data/ |  Folder with all the data files |
| ./data/countryItems.json |  File with all the products per country |
| ./data/europeDebt.csv |  File with all the debt per country |
| ./data/totalPopulation.json |  File with the population per country |
| ./data/worldGeoCodes.json |  File with all the geocodes per country |
| ./gh-images | Folder with the images used in the readme |
| ./assets |  Folder with the icons used in the application |


## Honorable mentions
  * Jonah Meijers for helping me fix the webpack config! (Due to the short amount of time in the end I asked Jonah if he had a working webpack config, he had one and helped me install it into my project.)  
  * Folkert Jan van de Pol insights in display circles on mapbox  
  * Laurens Aarnoudse for the Math.sqrt() function that gives a better perspective on the real scale of a circle.  

## Sources 
* [Datasets of debt and population](http://data.europa.eu/euodp/data/dataset)  
* [Mapbox information](https://www.mapbox.com/help/define-geocoding/)  
* [Famous foods from wikipedia (search for country dishes)](https://wikipedia.com)  
* [Country geocodes](https://developers.google.com/public-data/docs/canonical/countries_csv)  

## License
[MIT LICENSE](license.txt)
