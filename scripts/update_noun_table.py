""" Look up online dictionary and than fill the missing entries in table/perfekt.csv 
"""
import requests
from bs4 import BeautifulSoup
import pandas as pd

from time import sleep
import random

from tqdm import tqdm
from googletrans import Translator


def update(filename: str):
    df_noun = pd.read_csv(filename)
    df_noun = df_noun.sort_values("german")
    df_noun = update_article_and_plural(df_noun)
    df_noun = update_english(df_noun)
    df_noun.drop_duplicates(inplace=True)
    df_noun.to_csv(filename, index=False)


def update_article_and_plural(df: pd.DataFrame):
    for i in tqdm(range(len(df.index))):
        en, article, ge, plural = df.iloc[i, :]
        if pd.isnull(article) or pd.isnull(plural):
            article_, plural_ = fetch_online_dic(ge)
            df.iloc[i, 1] = article_
            df.iloc[i, 3] = plural_

    return df


def update_english(df: pd.DataFrame):
    translator = Translator()
    for i in tqdm(range(len(df.index))):
        en, article, ge, plural = df.iloc[i, :]
        if pd.isnull(en):
            en_ = fetch_online_translate(ge, translator)
            df.iloc[i, 0] = en_
    return df


def fetch_online_dic(noun: str):
    url = "https://www.verbformen.com/declension/nouns/{}.htm".format(
        noun)
    try:
        sleep(random.uniform(0.5, 1.2))
        page = requests.get(url)
        html = page.content.decode("utf-8")
        soup = BeautifulSoup(html, features="html.parser")
        tr = soup.find("div", {"class": "vTbl"}).find("tr")
        tds = tr.find_all("td")
        article = tds[0].text

        tr = soup.find(
            "div", {"class": "vTbl", "style": "z-index: 7;"}).find("tr")
        tds = tr.find_all("td")
        plural = tds[1].text
    except:
        return None, None

    plural = plural.split("/")[0]
    for c in ["⁰", "⁴", "⁹"]:
        plural = plural.replace(c, "")


    return article, plural


def fetch_online_translate(verb: str, translator):
    return translator.translate(verb, src="de", dest="en").text.lower()


if __name__ == "__main__":
    filename = "tables/noun.csv"
    update(filename)
