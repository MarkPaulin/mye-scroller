# Code for creating clean .json data  ------------------------------------------

library(tidyverse)
library(readxl)
library(here)
library(jsonlite)


# Chart 1, population 1993 to 2018    ------------------------------------------
# Read in data downloaded from NISRA website

if (!file.exists(here("..", "data", "raw_data", "MYE18_SYA.xlsx"))) {
  download.file(
    "https://www.nisra.gov.uk/sites/nisra.gov.uk/files/publications/MYE18_SYA.xlsx",
    here("..", "data", "raw_data", "MYE18_SYA.xlsx"),
    mode = "wb"
  )
}

if (!file.exists(here("..", "data", "clean_data", "mye18_sya.csv"))) {
  
  raw_sya <- read_xlsx(here("..", "data", "raw_data", "MYE18_SYA.xlsx"), sheet = 2)
  
  write_csv(raw_sya, here("..", "data", "clean_data", "mye18_sya.csv"))
  
} else {
  
  raw_sya <- read_csv(here("..", "data", "clean_data", "mye18_sya.csv"))
  
}


chart1 <- raw_sya %>% 
  filter(
    area == "1. Northern Ireland",
    year >= 2002,
    gender == "All persons"
  ) %>% 
  group_by(year) %>% 
  summarise(MYE = sum(MYE))

write_json(chart1, here("..", "data", "clean_data", "chart1.json"))


# Chart 2, population change 1993 to 2018    -----------------------------------

chart2 <- raw_sya %>% 
  filter(
    area == "1. Northern Ireland",
    year >= 2001,
    gender == "All persons"
  ) %>% 
  group_by(year) %>% 
  summarise(MYE = sum(MYE)) %>% 
  mutate(
    change = (MYE - lag(MYE)) / lag(MYE),
    tot_change = MYE - lag(MYE)
  ) %>% 
  filter(year >= 2002)

write_json(chart2, here("..", "data", "clean_data", "chart2.json"))


# chart 3, components of change 2001 to 2018    --------------------------------

if (!file.exists(here("..", "data", "raw_data", "MYE18_CoC.xlsx"))) {
  download.file(
    "https://www.nisra.gov.uk/sites/nisra.gov.uk/files/publications/MYE18_CoC.xlsx",
    here("..", "data", "raw_data", "MYE18_CoC.xlsx"),
    mode = "wb"
  )
}

if (!file.exists(here("..", "data", "clean_data", "mye18_coc.csv"))) {
  
  raw_coc <- read_xlsx(here("..", "data", "raw_data", "MYE18_CoC.xlsx"), sheet = 2)
  
  write_csv(raw_coc, here("..", "data", "clean_data", "mye18_coc.csv"))
  
} else {
  
  raw_coc <- read_csv(here("..", "data", "clean_data", "mye18_coc.csv"))
  
}

chart3 <- raw_coc %>% 
  filter(area == "1. Northern Ireland") %>% 
  select(year, category, MYE) %>% 
  filter(category %in% c("Total Net", "Natural Change")) %>% 
  mutate(year = str_extract(year, "\\d{4}$")) %>% 
  spread(category, MYE) %>% 
  mutate(
    `Overall Change` = `Total Net` + `Natural Change`
  ) %>% 
  rename(`Net Migration` = `Total Net`) %>% 
  gather(component, change, -year) %>% 
  arrange(year, desc(component))

write_json(chart3, here("..", "data", "clean_data", "chart3.json"))  

# chart 4, age and gender, 2008 and 2018    ------------------------------------

chart4 <- raw_sya %>% 
  filter(
    area == "1. Northern Ireland",
    year %in% c(2008, 2018),
    gender != "All persons"
  ) %>% 
  select(year, gender, age, MYE)

write_json(chart4, here("..", "data", "clean_data", "chart4.json"))
