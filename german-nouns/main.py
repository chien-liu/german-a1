from time import sleep
import pandas as pd
import requests
from bs4 import BeautifulSoup


def read_nouns_txt(path):
    with open(path, "r") as f:
        lines = f.readlines()
        nouns = [l.strip() for l in lines]
        # df = pd.DataFrame({"articles":[], "english":nouns, "plural":[]})
        return nouns


def get_article(noun):
    url = "https://www.verbformen.com/declension/nouns/{}.htm".format(noun)
    try:
        sleep(1)
        page = requests.get(url)
        html = page.content.decode("utf-8")
        soup = BeautifulSoup(html, features="html.parser")
        tr = soup.find("div", {"class": "vTbl"}).find("tr")
        tds = tr.find_all("td")
        article = tds[0].text
    except:
        return None
    print(article)
    return article


def get_plural(noun):
    url = "https://www.verbformen.com/declension/nouns/{}.htm".format(noun)
    try:
        sleep(1)
        page = requests.get(url)
        html = page.content.decode("utf-8")
        soup = BeautifulSoup(html, features="html.parser")
        tr = soup.find(
            "div", {"class": "vTbl", "style": "z-index: 7;"}).find("tr")
        tds = tr.find_all("td")
        plural = tds[1].text
    except:
        return None
    print(plural)
    return plural


if __name__ == "__main__":
    nouns = read_nouns_txt("nouns.txt")

    plurals = [get_plural(n) for n in nouns]
    articles = [get_article(n) for n in nouns]

    df = pd.DataFrame({"article": articles, "noun": nouns, "plural": plurals})
    df.to_csv("nouns.csv", index=False)
