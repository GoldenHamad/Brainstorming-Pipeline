POWER APPS EXPORT — Advisory AI Ideas
======================================

This folder contains everything you need to build the Advisory AI Ideas
Canvas App in Microsoft Power Apps.

FILES
-----

data/
  AI_Ideas.csv              8 mock ideas ready for Dataverse import
  AI_IdeaAssessments.csv    5 assessments for the assessed ideas
  AI_Prompts.csv            16 curated prompts ready for Dataverse import
  Choice_Values.csv         All choice/enum values for Dataverse columns

PowerFx_Formulas.txt        Complete Power Fx formulas for all 10 screens
                            (copy-paste into Power Apps Studio)

Build_Instructions.doc      Step-by-step build guide (Day 1-5)
                            Open in Word for formatted version


HOW TO USE
----------

1. Open the CSV files in Excel and save as .xlsx
2. Follow Build_Instructions.doc starting from Day 1
3. Create Dataverse tables and import the .xlsx data files
4. Build each Canvas App screen following the instructions
5. Copy formulas from PowerFx_Formulas.txt into each screen
6. Test, theme, and publish


DATA IMPORT ORDER
-----------------

1. AI_Ideas.csv        → AI Idea table
2. AI_IdeaAssessments.csv → AI Idea Assessment table (needs AI Idea first)
3. AI_Prompts.csv      → AI Prompt table
4. (AI Prompt Rating table starts empty)
