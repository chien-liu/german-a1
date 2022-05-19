""" Look up online dictionary and than fill the missing entries in table/perfekt.csv 
"""
import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm


def update(filename: str):
    df_perfekt = pd.read_csv(filename)
    df_perfekt = _update_perfekt(df_perfekt)
    df_perfekt.to_csv(filename, index=False)


def update_perfekt(df: pd.DataFrame):
    for i in tqdm(range(len(df.index))):
        en, ge, aux, per = df.iloc[i, :]
        aux_, per_ = _fetch_online_dic(ge)
        assert per == per_, "Wrong perfekt tense."
        df.iloc[i, 2] = aux_

    return df


def fetch_online_dic(verb: str):
    url = "https://conjugator.reverso.net/conjugation-german-verb-{}.html".format(
        verb)
    page = requests.get(url)

    # Decode the page content from bytes to string
    html = page.content.decode("utf-8")
    soup = BeautifulSoup(html, features="html.parser")
    ul = soup.find("div", {"mobile-title": "Indikativ Perfekt"}).find("ul")
    lis = ul.find_all("li")
    li = lis[2].text.split(" ")
    auxiliary, perfekt = li[1], li[2]
    return auxiliary, perfekt


if __name__ == "__main__":
    filename = "tables/perfekt.csv"
    update(filename)