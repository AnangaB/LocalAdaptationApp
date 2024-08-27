import os
from pathlib import Path
import sys
import pandas as pd
import re 
import json

#Define the journal names and their abbreviations
journals_abbreviations = {
    'Annals of the New York Academy of Sciences': 'Ann. N. Y. Acad. Sci.',
    'Annual Review of Ecology and Systematics': 'Annu. Rev. Ecol. Syst.',
    'Annual Review of Ecology, Evolution, and Systematics': 'Annu. Rev. Ecol. Evol. Syst.',
    'Annual Review of Genetics': 'Annu. Rev. Genet.',
    'Behavioral Ecology and Sociobiology': 'Behav. Ecol. Sociobiol.',
    'BioScience': 'BioScience',
    'Bulletin of Mathematical Biology': 'Bull. Math. Biol.',
    'Conservation Biology': 'Conserv. Biol.',
    'Discrete & Continuous Dynamical Systems': 'Discrete Contin. Dyn. Syst.',## should double check
    'Ecography': 'Ecography',
    'Ecology and Evolution': 'Ecol. Evol.',
    'Ecology Letters': 'Ecol. Lett.',
    'Evolution: International Journal of Organic Evolution': 'Evolution',
    'Evolution Letters': 'Evol. Lett.',
    'Evolutionary Applications': 'Evol. Appl.',
    'Evolutionary Ecology': 'Evol. Ecol.',
    'Evolutionary Ecology Research': 'Evol. Ecol. Res.',
    'Frontiers in Ecology and Evolution': 'Front. Ecol. Evol.',
    'Frontiers in Plant Science': 'Front. Plant Sci.',
    'Functional Ecology': 'Funct. Ecol.',
    'Genetica': 'Genetica',
    'Genetical Research': 'Genet. Res. (Camb.)',### does this journal even exist
    'Genetics': 'Genetics',
    'Genetics Research': 'Genet. Res. (Camb.)',
    'Genome': 'Genome',
    'Heredity': 'Heredity (Hered.)', ## acording to wiki, but the brackets at the end looks off
    'Interface Focus': 'Interface Focus',
    'International Journal of Ecology': 'Int. J. Ecol.',   ## couldn't verify this, but should be valid iso4 format
    'Journal of Arid Land': 'J. Arid Land',  ## couldn't verify this, but should be valid iso4 format
    'Journal of Ecology': 'J. Ecol.',
    'Journal of Evolutionary Biology': 'J. Evol. Biol.',
    'Journal of Heredity': 'J. Hered.',
    'Journal of Mathematical Analysis and Applications': 'J. Math. Anal. Appl.',
    'Journal of Mathematical Biology': 'J. Math. Biol.',
    'Journal of The Royal Society Interface': 'J. R. Soc. Interface',
    'Journal of Theoretical Biology': 'J. Theor. Biol.',
    'Methods in Ecology and Evolution': 'Methods Ecol. Evol.',
    'Molecular Biology and Evolution': 'Mol. Biol. Evol.',
    'Molecular Ecology': 'Mol. Ecol.',
    'Nature': 'Nature',
    'Nature Climate Change': 'Nat. Clim. Chang.',
    'Nature Communications': 'Nat. Commun.',
    'Nature Ecology & Evolution': 'Nat. Ecol. Evol.',
    'Nature Reviews Genetics': 'Nat. Rev. Genet.',
    'New Phytologist': 'New Phytol.',
    'Nonlinearity': 'Nonlinearity',
    'Oikos': 'Oikos',
    'Philosophical Transactions of the Royal Society B: Biological Sciences': 'Phil. Trans. R. Soc. B',
    'Philosophical Transactions of the Royal Society of London. Series B, Biological Sciences': 'Philos. Trans. R. Soc. Lond. B Biol. Sci.', ## need to check if this is the same as last time, seems to be so according to https://www.jstor.org/journal/philtranroyasoc2
    'Physical Review Research': 'Phys. Rev. Res.',
    'PLOS Biology': 'PLOS Biol.',
    'PLOS Computational Biology': 'PLOS Comput. Biol.',
    'PLOS Genetics': 'PLoS Genet.', ## not sure if the o should be capitalized or not, for the PLOS above, wikipedia has the O capitalized, while for this one, the o is lower cased
    'PLOS ONE': 'PLOS ONE',
    'Population Ecology': 'Popul. Ecol.', ## flagging this
    'Proceedings of the National Academy of Sciences': 'Proc. Natl. Acad. Sci.',
    'Proceedings of the National Academy of Sciences of the United States of America': 'Proc. Natl. Acad. Sci. U.S.A.',
    'Proceedings of the Royal Society B: Biological Sciences': 'Proc. R. Soc. B',
    'Proceedings of the Royal Society of London. Series B: Biological Sciences': 'Proc. R. Soc. Lond. B Biol. Sci.',## cant verify this
    'Proceedings: Biological Sciences': 'Proc. Biol. Sci.', ## seems to be the newer version of Proceedings of the Royal Society B: Biological Sciences, as said https://www.jstor.org/journal/procbiolscie
    'Restoration Ecology': 'Restor. Ecol.',
    'Science': 'Science',
    'Selection': 'Selection', ## cant verify this one, seems to be discontinued https://akjournals.com/view/journals/076/076-overview.xml
    'Spatial Statistics': 'Spat. Stat.',
    'The American Naturalist': 'Am. Nat.',
    'Theoretical Ecology': 'Theor. Ecol.',
    'Theoretical Population Biology': 'Theor. Popul. Biol.',
    'Trends in Ecology & Evolution': 'Trends Ecol. Evol.',
    'Trends in Genetics': 'Trends Genet.',
    'Trends in Parasitology': 'Trends Parasitol. (Parasitol. Today)' # flagging this, this journal used to be called Parasitology Today
}

#Replace letters with accents with it's anglaphied pair, removed occurences of the character ~, and removed curly brackets around a word({ }).
def remove_tex_accents(text):
    patterns = [
        (r"{\\'\s*(\w)}", r"\1"),     # \'e -> e
        (r"{\\`\s*(\w)}", r"\1"),     # \`e -> e
        (r"{\\\^\s*(\w)}", r"\1"),     # \^e -> e
        (r"{\\\"\s*(\w)}", r"\1"),    # \"e -> e
        (r"{\\~\s*(\w)}", r"\1"),     # \~e -> e
        (r"{\\=\s*(\w)}", r"\1"),     # \=e -> e
        (r"{\\u\s*(\w)}", r"\1"),     # \ue -> e
        (r"{\\v\s*(\w)}", r"\1"),     # \ve -> e
        (r"{\\c\s*(\w)}", r"\1"),     # \ce -> e
        (r"{\\d\s*(\w)}", r"\1"),     # \de -> e
        (r"{\\H\s*(\w)}", r"\1"),     # \He -> e
        (r"{\\t\s*(\w)}", r"\1"),     # \te -> e
        (r"{\\b\s*(\w)}", r"\1"),     # \be -> e
        (r"{\\k\s*(\w)}", r"\1"),     # \ke -> e
        (r"{\\r\s*(\w)}", r"\1"),     # \re -> e
        (r"{\\c\s*(\w)}",r"\1"),     # {\c c} -> c
        (r"{\\H\s*(\w)}",r"\1"),     # {\H c} -> c
        (r"{\\(ae)}",r"\1"),     #{\ae} -> ae
        (r"{(\S*)}",r"\1"),      #{someLetters} -> someLetters 
        (r"(~)",r"")             # ~ -> 
    ]
    for pattern, replacement in patterns:
        text = re.sub(pattern, replacement, text)

    return text

# replace {{ }} or {{{ }}} surrounding words, with just the inner words, and replaced occurences of -- or --- with just a -
def cleanUpTitle(text):
        
    patterns = [
        (r'{{|}}', ''),
        (r'---|--', '-')
    ]

    for pattern, replacement in patterns:
        text = re.sub(pattern, replacement, text)

    return text

#Replaced '\\&' to '&'
#I still have to replace some of na values.
def cleanUpJournal(text):
    patterns = [
        (r'\\&', r"&")
    ]
    for pattern, replacement in patterns:
        text = re.sub(pattern, replacement, text)
    return text

#Logic for generating Citation Key name (will need author names and date):

    #- if one author abc then paper name = "abc " + date
    #- if two author abc and def then paper name = "abc" + " & " + "def" + date
    #- if more than two author, such as abc, def,ghi, then paper name = "abc " + " et al. " + date
    #- if author name is already of form "abc et al" then paper name = author name

def getPaperName(authors, year):
    
    if "et al" in authors:
        return authors + " " + (year)
    nameList = authors.split(" and ")

    if len(nameList) == 1:
        return nameList[0].split(",")[0] + " " + (year)
    elif len(nameList) == 2:
        return nameList[0].split(",")[0] + " & " + nameList[1].split(",")[0] + " " + (year)
    elif len(nameList) > 2:
        return nameList[0].split(",")[0] + " et al. " + (year)
    return ""


def main():
    # Check if the user provided a command-line argument
    if len(sys.argv) < 2:
        print("Error: No file path provided. Please provide the path to the .xlsx file.")
        print("Example: python '.\\process_raw_dataset_ and_update_website.py' 'rawData.xlsx'")
        sys.exit(1)  # Exit with an error code


    #raw excel dataset location
    
    data_file = sys.argv[1]

    # Check if the file exists
    if not os.path.exists(data_file):
        print(f"Error: The file {data_file} does not exist.")
        sys.exit(1) 

    # Check if the file has the .xlsx extension
    file_extension = Path(data_file).suffix
    if file_extension.lower() != '.xlsx':
        print(f"Error: The file {data_file} is not of .xlsx format.")
        sys.exit(1)  # Exit with an error code

    data = pd.read_excel(data_file)

    #clean up Author Names
    data["Old Authors Data"] = data["Authors"]
    data["Authors"] = data["Authors"].map(lambda d: remove_tex_accents(d))

    #clean up the title
    data["Old Title"] = data["Title"]
    data["Title"] = data["Title"].map(lambda d: cleanUpTitle(str(d)))

    ### Clean up Journal Title
    data["Old Journal"] = data["Journal"]
    data["Journal"] = data["Journal"].map(lambda d: cleanUpJournal(str(d)))

    #Generate the Journal Abbreviations
    data["Journal ISO Abbreviation"] = data["Journal"].map(journals_abbreviations)

    # Generate Citation Keys
    data["Citation Key"] = pd.Series(data.apply(lambda row: getPaperName(row["Authors"],str(row["Year"])), axis=1 )).astype(str).replace(r'\.0', '', regex=True)

    # label duplicate citation keys by appending _1, _2,.. to it
    data['cite_key_duplicate_count'] = data.groupby('Citation Key').cumcount() + 1
    #(data['Citation Key'] == row['Citation Key']).sum() > 1 checks if row['Citation Key'] value appears more than once in column
    data['Citation Key'] = data.apply(lambda row: f"{row['Citation Key']}_{row['cite_key_duplicate_count']}" if row['cite_key_duplicate_count'] > 1 or (data['Citation Key'] == row['Citation Key']).sum() > 1 else row['Citation Key'], axis=1)
    data = data.drop(columns=['cite_key_duplicate_count'])

    #replace blanks or nas with "Unknown"
    data = data.fillna("Unknown")

    # Convert "Mullti Model" to "Multi Model" in the 'Scope' column
    data['Scope'] = data['Scope'].replace('Mullti Model', 'Multi Model')

    #only keep rows with scope of Singlemodel and multimodel and remove scope column
    scope_to_keep = ["Single Model","Multi Model"]
    data = data[data["Scope"].isin(scope_to_keep)]
    """"
    #Link to the bibtex file
    f = open('ZoteroFile.json')
    
    zoteroFile = json.load(f)
    zoteroDF = pd.DataFrame(zoteroFile["items"])
    """
    #export df
    exportingDF = data[["Citation Key",'Authors', 'Year', 'Journal', 'Journal ISO Abbreviation', 'Title',
        'Abstract', 'Keywords', 'Open Access', 'Reviewer 1', 'Reviewer 2',
        'Scope', 'Eco-Evo Focus', 'Life history', 'Ecological Loci/Traits',
        'Additional Loci/Traits', 'Mating system', 'Ploidy', 'Selection',
        'Spatial Structure ', 'Population Size', 'Ecological Model',
        'Recurrent Mutation', 'IBS']]

    exportingDF.to_excel("./../data.xlsx")


if __name__ == '__main__':
    main()
