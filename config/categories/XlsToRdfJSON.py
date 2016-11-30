#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import xlrd
from string import Template
import re

workbook = xlrd.open_workbook('GW portal list of icons November 2016.xlsx')
# workbook = xlrd.open_workbook('articlestats.xls', encoding='cp1252')
# workbook = xlrd.open_workbook('articlestats.xls', on_demand = True)

worksheet = workbook.sheet_by_name('science domain categories')


# worksheet = workbook.sheet_by_index(0)
# workbook.nsheets
# workbook.sheet_names()

# Number	Item	Contact person	Query string	def keyword tag	bg-icon file	icon file	Research programme (if relevant)	Text
class CategoryHolder:
    def __init__(self, number, id):
        self.number = number
        self.id = id
        self.parent = 'main'
        self.item = ''
        self.contact_person = ''
        self.query_string = ''
        self.def_keyword_tag = ''
        self.bg_icon_file = ''
        self.icon_file = ''
        self.research_programme = ''
        self.text = ''

    def toString(self):
        return """{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}""".format(self.number,
                                                                       self.id,
                                                                       self.item,
                                                                       self.parent,
                                                                       self.contact_person,
                                                                       self.query_string,
                                                                       self.def_keyword_tag,
                                                                       self.bg_icon_file,
                                                                       self.icon_file,
                                                                       self.research_programme,
                                                                       self.text)

    def toJson(self):
        return '{ \"hierarchy_number\": \"%s\", \n' \
               '\"id\": \"%s\", \n' \
               '\"item_name\": \"%s\", \n' \
               '\"parent\": \"%s\", \n' \
               '\"contact_person\": \"%s\", \n' \
               '\"query_string\": \"%s\", \n' \
               '\"keyword_tag\": \"%s\", \n' \
               '\"bg_icon\": \"%s\", \n' \
               '\"icon\": \"%s\", \n' \
               '\"research_programmes\": \"%s\", \n' \
               '\"description\": \"%s\" }' % (self.number,
                                              self.id,
                                              self.item,
                                              self.parent,
                                              self.contact_person,
                                              self.query_string,
                                              self.def_keyword_tag,
                                              self.bg_icon_file,
                                              self.icon_file,
                                              self.research_programme,
                                              self.text)


cat_list = []
parent_list = []
parent = 'main'
p = re.compile('Item \(([\w\s,.-]+)\)', re.IGNORECASE)

for i in range(1, 91):
    if worksheet.cell(i, 0).value == xlrd.empty_cell.value:
        pass
    else:
        number = str(worksheet.cell(i, 0).value)
        item = str(worksheet.cell(i, 1).value)
        # print(' row(+1) ' + str(i) + ' number ' + str(number))
        # print(' row(+1) ' + str(i) + ' item ' + str(item))

        if number == 'Number':
            if item == 'Item':
                parent = 'main'
            else:
                matcher = p.search(item)
                if matcher != None:
                    plist = p.findall(item)
                    parent = ''.join(plist)
            pass
        else:
            # print(parent)
            try:
                cat = CategoryHolder(number, i)
                cat.item = item
                cat.parent = parent
                cat.contact_person = worksheet.cell(i, 2).value
                cat.query_string = worksheet.cell(i, 3).value
                cat.def_keyword_tag = worksheet.cell(i, 4).value
                cat.bg_icon_file = worksheet.cell(i, 5).value
                cat.icon_file = worksheet.cell(i, 6).value
                cat.research_programme = worksheet.cell(i, 7).value
                cat.text = worksheet.cell(i, 8).value
                if parent == 'main':
                    list.append(parent_list, cat)
                else:
                    list.append(cat_list, cat)
                    # print(cat.toJson())
            except KeyError:
                print('key error')
            except ValueError:
                print('value error')
            except:
                print('error')

# print(""" { 'categories' : [ """)

catJsonHeader = """ { \n \"categories\" : [ """

parentJsonList = []

for parentElem in parent_list:

    childJsonList = []

    for childElem in cat_list:
        if childElem.parent == parentElem.query_string:
            # print(childElem.toJson() + ', ')
            list.append(childJsonList, childElem.toJson())
        else:
            pass

    parentJsonString = '{ \"hierarchy_number\": \"%s\", \n' \
                       '\"id\": \"%s\", \n' \
                       '\"item_name\": \"%s\", \n' \
                       '\"parent\": \"%s\", \n' \
                       '\"contact_person\": \"%s\", \n' \
                       '\"query_string\": \"%s\", \n' \
                       '\"keyword_tag\": \"%s\", \n' \
                       '\"bg_icon\": \"%s\", \n' \
                       '\"icon\": \"%s\", \n' \
                       '\"research_programmes\": \"%s\", \n' \
                       '\"description\": \"%s\", \n' \
                       '\"children\": [ %s ] }' % (parentElem.number,
                                                   parentElem.id,
                                                   parentElem.item,
                                                   parentElem.parent,
                                                   parentElem.contact_person,
                                                   parentElem.query_string,
                                                   parentElem.def_keyword_tag,
                                                   parentElem.bg_icon_file,
                                                   parentElem.icon_file,
                                                   parentElem.research_programme,
                                                   parentElem.text,
                                                   ', \n'.join(childJsonList))

    list.append(parentJsonList, parentJsonString)
    # json_children = ', %s \"children\": [ ' % parentJsonString
    # print(json_children)
    # print(""" ]},""")

# print(""" ]}""")
catJsonFooter = """ \n]}"""

parentJsonFull = ', \n'.join(parentJsonList)

fullJsonString = catJsonHeader + parentJsonFull + catJsonFooter

print(fullJsonString + '\n')

with open('categories.out.json', 'w') as out:
    out.write(fullJsonString + '\n')
