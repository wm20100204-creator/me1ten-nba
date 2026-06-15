'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// --- 2025-26 赛季 30 支球队详细名单数据库 (PART 1: 1-8 队) ---
const DETAILED_ROSTERS: Record<string, any[]> = {
  "LAL": [
    { no: "77", name: "Luka Dončić", pos: "PG" }, { no: "23", name: "LeBron James", pos: "SF" },
    { no: "05", name: "Deandre Ayton", pos: "C" }, { no: "36", name: "Marcus Smart", pos: "SG" },
    { no: "15", name: "Austin Reaves", pos: "SG" }, { no: "28", name: "Rui Hachimura", pos: "PF" },
    { no: "02", name: "Jarred Vanderbilt", pos: "PF" }, { no: "11", name: "Jaxson Hayes", pos: "C" },
    { no: "12", name: "Jake LaRavia", pos: "PF" }, { no: "04", name: "Dalton Knecht", pos: "SF" },
    { no: "14", name: "Maxi Kleber", pos: "PF" }, { no: "10", name: "Luke Kennard", pos: "SG" },
    { no: "09", name: "Bronny James", pos: "SG" }, { no: "20", name: "Nick Smith Jr.", pos: "SG" },
    { no: "17", name: "Drew Timme", pos: "PF" }, { no: "01", name: "Adou Thiero", pos: "SF" },
    { no: "30", name: "Chris Mañon", pos: "SG" }
  ],
  "DET": [
    { no: "02", name: "Cade Cunningham", pos: "PG" }, { no: "12", name: "Tobias Harris", pos: "PF" },
    { no: "00", name: "Jalen Duren", pos: "C" }, { no: "09", name: "Ausar Thompson", pos: "SF" },
    { no: "05", name: "Ron Holland", pos: "SF" }, { no: "55", name: "Duncan Robinson", pos: "SG" },
    { no: "08", name: "Caris LeVert", pos: "SG" }, { no: "28", name: "Isaiah Stewart", pos: "C" },
    { no: "07", name: "Paul Reed", pos: "C" }, { no: "25", name: "Marcus Sasser", pos: "PG" },
    { no: "31", name: "Javonte Green", pos: "SG" }, { no: "27", name: "Kevin Huerter", pos: "SG" },
    { no: "24", name: "Daniss Jenkins", pos: "PG" }, { no: "20", name: "Chaz Lanier", pos: "SG" },
    { no: "35", name: "Tolu Smith", pos: "PF" }, { no: "14", name: "Wendell Moore Jr.", pos: "SG" },
    { no: "13", name: "Isaac Jones", pos: "PF" }
  ],
  "BOS": [
    { no: "00", name: "Jayson Tatum", pos: "PF" }, { no: "07", name: "Jaylen Brown", pos: "SF" },
    { no: "09", name: "Derrick White", pos: "SG" }, { no: "11", name: "Payton Pritchard", pos: "PG" },
    { no: "30", name: "Sam Hauser", pos: "PF" }, { no: "04", name: "Nikola Vučević", pos: "C" },
    { no: "88", name: "Neemias Queta", pos: "C" }, { no: "55", name: "Baylor Scheierman", pos: "SG" },
    { no: "27", name: "Jordan Walsh", pos: "PF" }, { no: "52", name: "Luka Garza", pos: "C" },
    { no: "28", name: "Hugo González", pos: "SF" }, { no: "13", name: "Ron Harper Jr.", pos: "SF" },
    { no: "77", name: "Amari Williams", pos: "PF" }, { no: "44", name: "Max Shulga", pos: "SG" },
    { no: "08", name: "John Tonje", pos: "SG" }, { no: "45", name: "Dalano Banton", pos: "PG" }
  ],
  "NYK": [
    { no: "11", name: "Jalen Brunson (FMVP)", pos: "PG" }, { no: "32", name: "Karl-Anthony Towns", pos: "C" },
    { no: "25", name: "Mikal Bridges", pos: "SF" }, { no: "08", name: "OG Anunoby", pos: "PF" },
    { no: "03", name: "Josh Hart", pos: "SF" }, { no: "00", name: "Jordan Clarkson", pos: "SG" },
    { no: "23", name: "Mitchell Robinson", pos: "C" }, { no: "13", name: "Tyler Kolek", pos: "PG" },
    { no: "02", name: "Miles McBride", pos: "PG" }, { no: "44", name: "Landry Shamet", pos: "SG" },
    { no: "51", name: "Mohamed Diawara", pos: "SF" }, { no: "55", name: "Ariel Hukporti", pos: "C" },
    { no: "04", name: "Pacôme Dadiet", pos: "SG" }, { no: "05", name: "Jose Alvarado", pos: "PG" },
    { no: "09", name: "Kevin McCullar Jr.", pos: "SF" }, { no: "20", name: "Jeremy Sochan", pos: "PF" },
    { no: "50", name: "Trey Jemison", pos: "C" }, { no: "01", name: "Dillon Jones", pos: "SF" }
  ],
  "WAS": [
    { no: "23", name: "Anthony Davis", pos: "PF" }, { no: "32", name: "Cooper Flagg", pos: "SF" },
    { no: "20", name: "Alex Sarr", pos: "C" }, { no: "03", name: "Trae Young", pos: "PG" },
    { no: "07", name: "Bub Carrington", pos: "PG" }, { no: "13", name: "Jordan Poole", pos: "SG" },
    { no: "33", name: "Kyle Kuzma", pos: "PF" }, { no: "00", name: "Bilal Coulibaly", pos: "SF" },
    { no: "27", name: "Will Riley", pos: "SF" }, { no: "09", name: "Justin Champagnie", pos: "SF" },
    { no: "12", name: "Tre Johnson", pos: "SG" }, { no: "16", name: "Anthony Gill", pos: "PF" },
    { no: "05", name: "Jamir Watkins", pos: "SG" }, { no: "00", name: "Tristan Vukcevic", pos: "C" },
    { no: "18", name: "Kyshawn George", pos: "SF" }, { no: "13", name: "Sharife Cooper", pos: "PG" },
    { no: "08", name: "Jaden Hardy", pos: "SG" }, { no: "01", name: "Cam Whitmore", pos: "SF" }
  ],
  "GSW": [
    { no: "30", name: "Stephen Curry", pos: "PG" }, { no: "10", name: "Jimmy Butler", pos: "SF" },
    { no: "23", name: "Draymond Green", pos: "PF" }, { no: "08", name: "Buddy Hield", pos: "SG" },
    { no: "02", name: "Brandin Podziemski", pos: "SG" }, { no: "00", name: "Jonathan Kuminga", pos: "PF" },
    { no: "21", name: "Quinten Post", pos: "PF" }, { no: "61", name: "Pat Spencer", pos: "PG" },
    { no: "04", name: "Moses Moody", pos: "SG" }, { no: "08", name: "De'Anthony Melton", pos: "PG" },
    { no: "32", name: "Trayce Jackson-Davis", pos: "C" }, { no: "15", name: "Gui Santos", pos: "PF" },
    { no: "00", name: "Gary Payton II", pos: "SG" }, { no: "03", name: "Will Richard", pos: "SG" },
    { no: "31", name: "Seth Curry", pos: "SG" }, { no: "28", name: "Charles Bassey", pos: "C" }
  ],
  "SAS": [
    { no: "01", name: "Victor Wembanyama", pos: "C" }, { no: "19", name: "Ace Bailey", pos: "SF" },
    { no: "05", name: "Stephon Castle", pos: "PG" }, { no: "24", name: "Devin Vassell", pos: "SG" },
    { no: "10", name: "Jeremy Sochan", pos: "PF" }, { no: "40", name: "Harrison Barnes", pos: "PF" },
    { no: "03", name: "Keldon Johnson", pos: "SF" }, { no: "30", name: "Julian Champagnie", pos: "SF" },
    { no: "04", name: "De'Aaron Fox", pos: "PG" }, { no: "11", name: "Carter Bryant", pos: "PF" },
    { no: "02", name: "Dylan Harper", pos: "SG" }, { no: "07", name: "Luke Kornet", pos: "C" },
    { no: "00", name: "Jordan McLaughlin", pos: "PG" }, { no: "08", name: "Kelly Olynyk", pos: "C" }
  ],
  "OKC": [
    { no: "02", name: "Shai Gilgeous-Alexander", pos: "PG" }, { no: "07", name: "Chet Holmgren", pos: "C" },
    { no: "08", name: "Jalen Williams", pos: "PF" }, { no: "09", name: "Alex Caruso", pos: "SG" },
    { no: "55", name: "Isaiah Hartenstein", pos: "C" }, { no: "05", name: "Luguentz Dort", pos: "SF" },
    { no: "11", name: "Isaiah Joe", pos: "SG" }, { no: "22", name: "Cason Wallace", pos: "SG" },
    { no: "21", name: "Aaron Wiggins", pos: "SG" }, { no: "06", name: "Jaylin Williams", pos: "PF" },
    { no: "25", name: "Ajay Mitchell", pos: "SG" }, { no: "34", name: "Kenrich Williams", pos: "PF" },
    { no: "15", name: "Branden Carlson", pos: "C" }, { no: "23", name: "Brooks Barnhizer", pos: "SG" },
    { no: "03", name: "Jared McCain", pos: "SG" }, { no: "44", name: "Nikola Topić", pos: "PG" },
    { no: "14", name: "Payton Sandfort", pos: "SF" }, { no: "10", name: "Thomas Sorber", pos: "C" }
  ],
"DEN": [
    { no: "15", name: "Nikola Jokić", pos: "C" }, { no: "27", name: "Jamal Murray", pos: "PG" },
    { no: "11", name: "Bruce Brown", pos: "SG" }, { no: "10", name: "Tim Hardaway Jr.", pos: "SG" },
    { no: "17", name: "Jonas Valančiūnas", pos: "C" }, { no: "21", name: "Spencer Jones", pos: "SF" },
    { no: "03", name: "Julian Strawther", pos: "SG" }, { no: "08", name: "Peyton Watson", pos: "SF" },
    { no: "23", name: "Cameron Johnson", pos: "SF" }, { no: "22", name: "Zeke Nnaji", pos: "PF" },
    { no: "24", name: "Jalen Pickett", pos: "SG" }, { no: "00", name: "Christian Braun", pos: "SG" },
    { no: "32", name: "Aaron Gordon", pos: "PF" }, { no: "14", name: "DaRon Holmes", pos: "PF" },
    { no: "05", name: "Tyus Jones", pos: "PG" }, { no: "01", name: "Curtis Jones", pos: "SG" },
    { no: "25", name: "KJ Simpson", pos: "PG" }, { no: "45", name: "David Roddy", pos: "PF" }
  ],
  "MIN": [
    { no: "05", name: "Anthony Edwards", pos: "SG" }, { no: "10", name: "Mike Conley", pos: "PG" },
    { no: "30", name: "Julius Randle", pos: "PF" }, { no: "00", name: "Donte DiVincenzo", pos: "SG" },
    { no: "27", name: "Rudy Gobert", pos: "C" }, { no: "11", name: "Naz Reid", pos: "C" },
    { no: "03", name: "Jaden McDaniels", pos: "PF" }, { no: "08", name: "Bones Hyland", pos: "PG" },
    { no: "22", name: "Jaylen Clark", pos: "SG" }, { no: "01", name: "Terrence Shannon Jr.", pos: "SG" },
    { no: "19", name: "Joan Beringer", pos: "PF" }, { no: "07", name: "Joe Ingles", pos: "SF" },
    { no: "13", name: "Ayo Dosunmu", pos: "SG" }, { no: "12", name: "Kyle Anderson", pos: "SF" },
    { no: "04", name: "Julian Phillips", pos: "SF" }, { no: "15", name: "Zyon Pullin", pos: "SG" },
    { no: "44", name: "Rocco Zikarsky", pos: "C" }, { no: "25", name: "Enrique Freeman", pos: "PF" }
  ],
  "PHX": [
    { no: "01", name: "Devin Booker", pos: "SG" }, { no: "07", name: "Kevin Durant", pos: "PF" },
    { no: "08", name: "Grayson Allen", pos: "SG" }, { no: "11", name: "Oso Ighodaro", pos: "PF" },
    { no: "12", name: "Collin Gillespie", pos: "PG" }, { no: "00", name: "Royce O'Neale", pos: "SF" },
    { no: "23", name: "Jordan Goodwin", pos: "PG" }, { no: "00", name: "Ryan Dunn", pos: "SF" },
    { no: "15", name: "Mark Williams", pos: "C" }, { no: "03", name: "Dillon Brooks", pos: "SF" },
    { no: "20", name: "Rasheer Fleming", pos: "PF" }, { no: "17", name: "Jamaree Bouyea", pos: "PG" },
    { no: "10", name: "Khaman Maluach", pos: "C" }, { no: "18", name: "Isaiah Livers", pos: "PF" },
    { no: "04", name: "Jalen Green", pos: "SG" }, { no: "02", name: "Amir Coffey", pos: "SF" },
    { no: "14", name: "Koby Brea", pos: "SG" }, { no: "19", name: "Haywood Highsmith", pos: "SF" },
    { no: "22", name: "CJ Huntley", pos: "SF" }
  ],
  "DAL": [
    { no: "11", name: "Kyrie Irving", pos: "SG" }, { no: "31", name: "Klay Thompson", pos: "SF" },
    { no: "02", name: "Dereck Lively II", pos: "C" }, { no: "00", name: "Max Christie", pos: "SG" },
    { no: "13", name: "Naji Marshall", pos: "SF" }, { no: "32", name: "Cooper Flagg", pos: "SF" },
    { no: "10", name: "Brandon Williams", pos: "PG" }, { no: "07", name: "Dwight Powell", pos: "C" },
    { no: "09", name: "Ryan Nembhard", pos: "PG" }, { no: "16", name: "Caleb Martin", pos: "SF" },
    { no: "25", name: "P.J. Washington", pos: "PF" }, { no: "21", name: "Daniel Gafford", pos: "C" },
    { no: "30", name: "Moussa Cisse", pos: "C" }, { no: "20", name: "Khris Middleton", pos: "SF" },
    { no: "08", name: "AJ Johnson", pos: "SG" }, { no: "35", name: "Marvin Bagley III", pos: "PF" },
    { no: "01", name: "John Poulakidas", pos: "SG" }, { no: "23", name: "Tyler Smith", pos: "PF" }
  ],
  "CLE": [
    { no: "45", name: "Donovan Mitchell", pos: "SG" }, { no: "04", name: "Evan Mobley", pos: "PF" },
    { no: "31", name: "Jarrett Allen", pos: "C" }, { no: "10", name: "Darius Garland", pos: "PG" },
    { no: "01", name: "James Harden", pos: "PG" }, { no: "20", name: "Jaylon Tyson", pos: "SG" },
    { no: "35", name: "Nae'Qwan Tomlin", pos: "PF" }, { no: "09", name: "Craig Porter Jr.", pos: "PG" },
    { no: "03", name: "Thomas Bryant", pos: "C" }, { no: "32", name: "Dean Wade", pos: "PF" },
    { no: "05", name: "Sam Merrill", pos: "SG" }, { no: "24", name: "Tyrese Proctor", pos: "PG" },
    { no: "22", name: "Larry Nance Jr.", pos: "PF" }, { no: "08", name: "Dennis Schröder", pos: "PG" },
    { no: "14", name: "Keon Ellis", pos: "SG" }, { no: "02", name: "Max Strus", pos: "SF" },
    { no: "21", name: "Tristan Enaruna", pos: "SF" }, { no: "12", name: "Riley Minix", pos: "SF" },
    { no: "33", name: "Olivier Sarr", pos: "C" }
  ],
  "MIL": [
    { no: "34", name: "Giannis Antetokounmpo", pos: "PF" }, { no: "00", name: "Damian Lillard", pos: "PG" },
    { no: "03", name: "Myles Turner", pos: "C" }, { no: "18", name: "Kyle Kuzma", pos: "PF" },
    { no: "09", name: "Bobby Portis", pos: "PF" }, { no: "20", name: "A.J. Green", pos: "SG" },
    { no: "13", name: "Ryan Rollins", pos: "PG" }, { no: "00", name: "Jericho Sims", pos: "C" },
    { no: "05", name: "Gary Trent Jr.", pos: "SG" }, { no: "11", name: "Gary Harris", pos: "SG" },
    { no: "44", name: "Andre Jackson Jr.", pos: "SG" }, { no: "35", name: "Pete Nance", pos: "PF" },
    { no: "07", name: "Kevin Porter Jr.", pos: "PG" }, { no: "43", name: "Thanasis Antetokounmpo", pos: "SF" },
    { no: "21", name: "Ousmane Dieng", pos: "C" }, { no: "12", name: "Taurean Prince", pos: "SF" },
    { no: "30", name: "Cormac Ryan", pos: "SG" }, { no: "29", name: "Alex Antetokounmpo", pos: "SF" }
  ],
  "IND": [
    { no: "00", name: "Tyrese Haliburton", pos: "PG" }, { no: "43", name: "Pascal Siakam", pos: "PF" },
    { no: "33", name: "Myles Turner", pos: "C" }, { no: "02", name: "Andrew Nembhard", pos: "PG" },
    { no: "32", name: "Jay Huff", pos: "C" }, { no: "05", name: "Jarace Walker", pos: "PF" },
    { no: "26", name: "Ben Sheppard", pos: "SG" }, { no: "09", name: "T.J. McConnell", pos: "PG" },
    { no: "29", name: "Quenton Jackson", pos: "SG" }, { no: "11", name: "Micah Potter", pos: "C" },
    { no: "23", name: "Aaron Nesmith", pos: "SF" }, { no: "04", name: "Taelon Peter", pos: "SG" },
    { no: "07", name: "Kam Jones", pos: "SG" }, { no: "12", name: "Johnny Furphy", pos: "SG" },
    { no: "55", name: "Ethan Thompson", pos: "SG" }, { no: "24", name: "Kobe Brown", pos: "PF" },
    { no: "01", name: "Obi Toppin", pos: "PF" }, { no: "18", name: "Jalen Slawson", pos: "SF" },
    { no: "40", name: "Ivica Zubac", pos: "C" }
  ],
  "ORL": [
    { no: "05", name: "Paolo Banchero", pos: "PF" }, { no: "22", name: "Franz Wagner", pos: "SF" },
    { no: "04", name: "Jalen Suggs", pos: "PG" }, { no: "03", name: "Desmond Bane", pos: "SG" },
    { no: "34", name: "Wendell Carter Jr.", pos: "C" }, { no: "23", name: "Tristan Da Silva", pos: "SF" },
    { no: "00", name: "Anthony Black", pos: "PG" }, { no: "35", name: "Goga Bitadze", pos: "C" },
    { no: "93", name: "Noah Penda", pos: "SF" }, { no: "13", name: "Jett Howard", pos: "SF" },
    { no: "11", name: "Jase Richardson", pos: "SG" }, { no: "01", name: "Jonathan Isaac", pos: "PF" },
    { no: "08", name: "Jamal Cain", pos: "SF" }, { no: "21", name: "Moritz Wagner", pos: "C" },
    { no: "02", name: "Jevon Carter", pos: "PG" }, { no: "30", name: "Alex Morales", pos: "SG" },
    { no: "14", name: "Colin Castleton", pos: "C" }
  ],
  "HOU": [
    { no: "15", name: "Reed Sheppard", pos: "SG" }, { no: "01", name: "Amen Thompson", pos: "PG" },
    { no: "07", name: "Kevin Durant", pos: "PF" }, { no: "20", name: "Josh Okogie", pos: "SG" },
    { no: "10", name: "Jabari Smith Jr.", pos: "PF" }, { no: "30", name: "Clint Capela", pos: "C" },
    { no: "28", name: "Alperen Şengün", pos: "C" }, { no: "17", name: "Tari Eason", pos: "PF" },
    { no: "00", name: "Aaron Holiday", pos: "PG" }, { no: "08", name: "Jae'Sean Tate", pos: "SF" },
    { no: "02", name: "Dorian Finney-Smith", pos: "PF" }, { no: "12", name: "Steven Adams", pos: "C" },
    { no: "32", name: "Jeff Green", pos: "PF" }, { no: "04", name: "JD Davison", pos: "PG" },
    { no: "27", name: "Isaiah Crawford", pos: "SF" }, { no: "00", name: "Tristen Newton", pos: "SG" },
    { no: "05", name: "Fred VanVleet", pos: "PG" }
  ],
  "MEM": [
    { no: "23", name: "Jamal Shead", pos: "PG" }, { no: "04", name: "Scottie Barnes", pos: "PF" },
    { no: "54", name: "Sandro Mamukelashvili", pos: "C" }, { no: "03", name: "Brandon Ingram", pos: "SF" },
    { no: "01", name: "Gradey Dick", pos: "SG" }, { no: "14", name: "Ja'Kobe Walter", pos: "SG" },
    { no: "05", name: "Immanuel Quickley", pos: "PG" }, { no: "77", name: "Jamison Battle", pos: "SF" },
    { no: "09", name: "RJ Barrett", pos: "SF" }, { no: "12", name: "Collin Murray-Boyles", pos: "PF" },
    { no: "19", name: "Jakob Poeltl", pos: "C" }, { no: "02", name: "Jonathan Mogbo", pos: "PF" },
    { no: "00", name: "A.J. Lawson", pos: "SG" }, { no: "55", name: "Alijah Martin", pos: "SG" },
    { no: "17", name: "Garrett Temple", pos: "SG" }, { no: "32", name: "Trayce Jackson-Davis", pos: "C" },
    { no: "24", name: "Chucky Hepburn", pos: "PG" }
  ],
  "NOP": [
    { no: "00", name: "Jeremiah Fears", pos: "PG" }, { no: "22", name: "Derik Queen", pos: "C" },
    { no: "41", name: "Saddiq Bey", pos: "SF" }, { no: "25", name: "Trey Murphy III", pos: "SF" },
    { no: "21", name: "Yves Missi", pos: "C" }, { no: "01", name: "Zion Williamson", pos: "PF" },
    { no: "17", name: "Karlo Matković", pos: "PF" }, { no: "14", name: "Micah Peavy", pos: "SG" },
    { no: "02", name: "Herbert Jones", pos: "SF" }, { no: "24", name: "Jordan Hawkins", pos: "SG" },
    { no: "11", name: "Bryce McGowens", pos: "SG" }, { no: "03", name: "Jordan Poole", pos: "SG" },
    { no: "55", name: "Kevon Looney", pos: "C" }, { no: "05", name: "Dejounte Murray", pos: "PG" },
    { no: "06", name: "DeAndre Jordan", pos: "C" }, { no: "23", name: "Trey Alexander", pos: "SG" },
    { no: "04", name: "Hunter Dickinson", pos: "C" }, { no: "13", name: "Josh Oduro", pos: "PF" }
  ],
  "SAC": [
    { no: "10", name: "DeMar DeRozan", pos: "PF" }, { no: "05", name: "Nique Clifford", pos: "SG" },
    { no: "42", name: "Maxime Raynaud", pos: "C" }, { no: "09", name: "Precious Achiuwa", pos: "C" },
    { no: "18", name: "Russell Westbrook", pos: "SF" }, { no: "00", name: "Malik Monk", pos: "SG" },
    { no: "32", name: "Dylan Cardwell", pos: "C" }, { no: "19", name: "Drew Eubanks", pos: "C" },
    { no: "08", name: "Zach LaVine", pos: "SG" }, { no: "22", name: "Devin Carter", pos: "PG" },
    { no: "29", name: "Daeqwon Plowden", pos: "SG" }, { no: "07", name: "Doug McDermott", pos: "SF" },
    { no: "13", name: "Keegan Murray", pos: "PF" }, { no: "03", name: "Killian Hayes", pos: "PG" },
    { no: "11", name: "Domantas Sabonis", pos: "C" }, { no: "23", name: "Patrick Baldwin Jr.", pos: "SF" },
    { no: "24", name: "Isaiah Stevens", pos: "PG" }, { no: "15", name: "De'Andre Hunter", pos: "SF" }
  ],
  "POR": [
    { no: "33", name: "Toumani Camara", pos: "PF" }, { no: "23", name: "Donovan Clingan", pos: "C" },
    { no: "91", name: "Sidy Cissoko", pos: "SF" }, { no: "08", name: "Deni Avdija", pos: "SF" },
    { no: "35", name: "Robert Williams", pos: "C" }, { no: "09", name: "Jerami Grant", pos: "PF" },
    { no: "24", name: "Kris Murray", pos: "SF" }, { no: "05", name: "Jrue Holiday", pos: "PG" },
    { no: "17", name: "Shaedon Sharpe", pos: "SG" }, { no: "02", name: "Caleb Love", pos: "SG" },
    { no: "16", name: "Yang Hansen", pos: "C" }, { no: "01", name: "Blake Wesley", pos: "SG" },
    { no: "00", name: "Scoot Henderson", pos: "PG" }, { no: "04", name: "Matisse Thybulle", pos: "SG" },
    { no: "27", name: "Vít Krejčí", pos: "PG" }, { no: "29", name: "Jayson Kent", pos: "SF" },
    { no: "11", name: "Chris Youngblood", pos: "SG" }, { no: "00", name: "Damian Lillard", pos: "PG" }
  ],
  "BKN": [
    { no: "33", name: "Nic Claxton", pos: "C" }, { no: "21", name: "Noah Clowney", pos: "PF" },
    { no: "14", name: "Terance Mann", pos: "SG" }, { no: "04", name: "Drake Powell", pos: "SG" },
    { no: "20", name: "Day'Ron Sharpe", pos: "C" }, { no: "02", name: "Danny Wolf", pos: "PF" },
    { no: "01", name: "Ziaire Williams", pos: "SF" }, { no: "88", name: "Nolan Traoré", pos: "PG" },
    { no: "22", name: "Jalen Wilson", pos: "PF" }, { no: "17", name: "Michael Porter Jr.", pos: "SF" },
    { no: "08", name: "Egor Dëmin", pos: "PG" }, { no: "77", name: "Ben Saraf", pos: "SG" },
    { no: "09", name: "E.J. Liddell", pos: "PF" }, { no: "10", name: "Tyson Etienne", pos: "PG" },
    { no: "30", name: "Ochai Agbaji", pos: "SG" }, { no: "31", name: "Chaney Johnson", pos: "SF" },
    { no: "00", name: "Josh Minott", pos: "SF" }, { no: "18", name: "Malachi Smith", pos: "SG" }
  ],
  "CHA": [
    { no: "04", name: "Sion James", pos: "SG" }, { no: "07", name: "Kon Knueppel", pos: "SF" },
    { no: "00", name: "Miles Bridges", pos: "PF" }, { no: "14", name: "Moussa Diabaté", pos: "C" },
    { no: "01", name: "LaMelo Ball", pos: "PG" }, { no: "11", name: "Ryan Kalkbrenner", pos: "C" },
    { no: "24", name: "Brandon Miller", pos: "SF" }, { no: "10", name: "Josh Green", pos: "SG" },
    { no: "23", name: "Tre Mann", pos: "PG" }, { no: "21", name: "Pat Connaughton", pos: "SG" },
    { no: "31", name: "Tidjane Salaün", pos: "PF" }, { no: "02", name: "Grant Williams", pos: "PF" },
    { no: "33", name: "Liam McNeeley", pos: "SF" }, { no: "03", name: "Coby White", pos: "SG" },
    { no: "26", name: "Xavier Tillman Sr.", pos: "C" }, { no: "16", name: "PJ Hall", pos: "C" },
    { no: "12", name: "Antonio Reeves", pos: "SG" }, { no: "00", name: "Tosan Evbuomwan", pos: "SF" }
  ],
  "MIA": [
    { no: "07", name: "Kel'el Ware", pos: "C" }, { no: "11", name: "Jaime Jaquez Jr.", pos: "SF" },
    { no: "13", name: "Bam Adebayo", pos: "C" }, { no: "09", name: "Pelle Larsson", pos: "SG" },
    { no: "45", name: "Davion Mitchell", pos: "PG" }, { no: "00", name: "Simone Fontecchio", pos: "SF" },
    { no: "12", name: "Dru Smith", pos: "SG" }, { no: "22", name: "Andrew Wiggins", pos: "SF" },
    { no: "24", name: "Norman Powell", pos: "SG" }, { no: "25", name: "Kasparas Jakučionis", pos: "PG" },
    { no: "05", name: "Nikola Jović", pos: "PF" }, { no: "15", name: "Myron Gardner", pos: "SF" },
    { no: "14", name: "Tyler Herro", pos: "SG" }, { no: "16", name: "Keshad Johnson", pos: "SF" },
    { no: "17", name: "Jahmir Young", pos: "PG" }, { no: "50", name: "Vladislav Goldin", pos: "C" },
    { no: "08", name: "Trevor Keels", pos: "SG" }
  ],
  "UTA": [
    { no: "22", name: "Kyle Filipowski", pos: "C" }, { no: "28", name: "Brice Sensabaugh", pos: "SF" },
    { no: "19", name: "Ace Bailey", pos: "SF" }, { no: "05", name: "Cody Williams", pos: "SG" },
    { no: "08", name: "Isaiah Collier", pos: "PG" }, { no: "03", name: "Keyonte George", pos: "PG" },
    { no: "10", name: "Svi Mykhailiuk", pos: "SF" }, { no: "23", name: "Lauri Markkanen", pos: "PF" },
    { no: "30", name: "Jusuf Nurkić", pos: "C" }, { no: "42", name: "Kevin Love", pos: "PF" },
    { no: "34", name: "Oscar Tshiebwe", pos: "C" }, { no: "16", name: "Elijah Harkless", pos: "SG" },
    { no: "55", name: "John Konchar", pos: "SG" }, { no: "21", name: "Bez Mbeng", pos: "SG" },
    { no: "02", name: "Blake Hinson", pos: "SF" }, { no: "24", name: "Walker Kessler", pos: "C" },
    { no: "20", name: "Jaren Jackson Jr.", pos: "C" }, { no: "33", name: "Hayden Gray", pos: "SG" }
  ],
  "PHI": [
    { no: "77", name: "VJ Edgecombe", pos: "SG" }, { no: "05", name: "Quentin Grimes", pos: "SG" },
    { no: "25", name: "Dominick Barlow", pos: "PF" }, { no: "30", name: "Adem Bona", pos: "C" },
    { no: "00", name: "Tyrese Maxey", pos: "PG" }, { no: "11", name: "Justin Edwards", pos: "SF" },
    { no: "33", name: "Jabari Walker", pos: "PF" }, { no: "01", name: "Andre Drummond", pos: "C" },
    { no: "12", name: "Trendon Watford", pos: "PF" }, { no: "09", name: "Kelly Oubre Jr.", pos: "SF" },
    { no: "21", name: "Joel Embiid", pos: "C" }, { no: "08", name: "Paul George", pos: "PF" },
    { no: "16", name: "MarJon Beauchamp", pos: "SF" }, { no: "14", name: "Dalen Terry", pos: "SG" },
    { no: "07", name: "Kyle Lowry", pos: "PG" }, { no: "22", name: "Johni Broome", pos: "C" },
    { no: "23", name: "Tyrese Martin", pos: "SG" }
  ],
  "LAC": [
    { no: "01", name: "James Harden", pos: "PG" }, { no: "02", name: "Kawhi Leonard", pos: "SF" },
    { no: "40", name: "Ivica Zubac", pos: "C" }, { no: "24", name: "Norman Powell", pos: "SG" },
    { no: "05", name: "Derrick Jones Jr.", pos: "SF" }, { no: "14", name: "Terance Mann", pos: "SG" },
    { no: "33", name: "Nicolas Batum", pos: "PF" }, { no: "08", name: "Kris Dunn", pos: "PG" },
    { no: "07", name: "Kevin Porter Jr.", pos: "PG" }
  ],
  "CHI": [
    { no: "08", name: "Zach LaVine", pos: "SG" }, { no: "03", name: "Josh Giddey", pos: "PG" },
    { no: "03", name: "Coby White", pos: "SG" }, { no: "04", name: "Nikola Vučević", pos: "C" },
    { no: "44", name: "Patrick Williams", pos: "PF" }, { no: "14", name: "Matas Buzelis", pos: "PF" },
    { no: "02", name: "Lonzo Ball", pos: "PG" }
  ],
  "ATL": [
    { no: "11", name: "Trae Young", pos: "PG" }, { no: "10", name: "Zaccharie Risacher", pos: "SF" },
    { no: "01", name: "Jalen Johnson", pos: "PF" }, { no: "15", name: "Clint Capela", pos: "C" },
    { no: "08", name: "Bogdan Bogdanović", pos: "SG" }, { no: "05", name: "Dyson Daniels", pos: "SG" },
    { no: "17", name: "Onyeka Okongwu", pos: "C" }, { no: "07", name: "De'Andre Hunter", pos: "SF" }
  ],
  "TOR": [
    { no: "04", name: "Scottie Barnes", pos: "PF" }, { no: "09", name: "RJ Barrett", pos: "SF" },
    { no: "05", name: "Immanuel Quickley", pos: "PG" }, { no: "19", name: "Jakob Poeltl", pos: "C" },
    { no: "01", name: "Gradey Dick", pos: "SG" }, { no: "45", name: "Davion Mitchell", pos: "PG" },
    { no: "41", name: "Kelly Olynyk", pos: "PF" }
  ]
};

// 2. 球队荣誉库 (根据 2026 世界线校对)
// 30 支球队全量准确荣誉库 (截止 2026 年 6 月)
const TEAM_LEGACY: Record<string, any> = {
  // 东部 Eastern
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 历史夺冠王，2024年夺取第18冠，绿军王朝底蕴深厚。" },
  "CHI": { championships: 6, bio: "公牛队代表了乔丹时代的无上光荣，是 90 年代全球篮球的统治者。" },
  "PHI": { championships: 3, bio: "76人队历史底蕴深厚，从张伯伦到恩比德，始终是东部的核心竞争者。" },
  "DET": { championships: 3, bio: "底特律活塞是蓝领篮球的巅峰，曾以强悍防守打破了巨星对冠军的垄断。" },
  "MIA": { championships: 3, bio: "热火队在失去巴特勒后，由阿德巴约和维金斯领衔，继续贯彻铁血文化。" },
  "NYK": { championships: 3, bio: "【2026总冠军】尼克斯在布伦森(FMVP)的率领下开启三冠王朝，麦迪逊花园重回巅峰。" },
  "MIL": { championships: 2, bio: "密尔沃基雄鹿在字母哥的带领下保持着顶级的竞争力和内线统治力。" },
  "CLE": { championships: 1, bio: "2016 年詹姆斯带领骑士完成了总决赛史诗级的 1-3 逆转夺冠，改写了城市命运。" },
  "ATL": { championships: 1, bio: "老鹰队始终保持着极高的进攻节奏，是一支充满活力的南方劲旅。" },
  "WAS": { championships: 1, bio: "在得到安东尼·戴维斯并选中状元库珀·弗拉格后，奇才已成为全联盟最恐怖的争冠大热。" },
  "TOR": { championships: 1, bio: "作为唯一加拿大球队，猛龙在 2019 年书写了北境夺冠奇迹。" },
  "IND": { championships: 0, bio: "步行者代表了最纯粹的篮球热爱，打法极其无私且充满韧性。" },
  "ORL": { championships: 0, bio: "魔术队正迅速成长为东部新贵，防守体系和天赋上限令人期待。" },
  "BKN": { championships: 0, bio: "布鲁克林篮网致力于打造最前卫的都市篮球品牌。" },
  "CHA": { championships: 0, bio: "黄蜂队致力于打造全新的竞争身份，正处于新一代领袖的磨合期。" },

  // 西部 Western
  "LAL": { championships: 17, bio: "湖人队通过交易得到东契奇，詹东组合成为 2026 年全联盟最具统治力的双人组。" },
  "GSW": { championships: 7, bio: "吉米·巴特勒加盟辅助库里，勇士重新找回防守基因，开启最后的夺冠窗口。" },
  "SAS": { championships: 5, bio: "在克里斯·保罗功成身退后，文班亚马正携手 Ace Bailey 开启马刺新王朝。" },
  "HOU": { championships: 2, bio: "休斯顿火箭曾创造奥拉朱旺时代的连冠辉煌，目前正致力于航天城的重建。" },
  "DAL": { championships: 1, bio: "独行侠由欧文和克莱领衔，在东契奇离队后依然保持着极强的季后赛竞争性。" },
  "OKC": { championships: 1, bio: "雷霆队拥有极其恐怖的天赋储备，是西部未来几年的统治级竞争者。" },
  "DEN": { championships: 1, bio: "丹佛掘金拥有约基奇，以无私的传导球和高效进攻体系夺取了 2023 年总冠军。" },
  "POR": { championships: 1, bio: "开拓者在“撕裂之城”拥有最狂热的主场，坚韧与忠诚是这支球队的标签。" },
  "SAC": { championships: 1, bio: "国王队正通过华丽的进攻和极速的节奏重新找回 21 世纪初期的强队感觉。" },
  "PHX": { championships: 0, bio: "太阳队拥有杜兰特等顶级得分手，是全联盟进攻火力最猛的球队之一。" },
  "LAC": { championships: 0, bio: "快船队正在新球馆开启新纪元，致力于打破洛杉矶的旧格局。" },
  "MIN": { championships: 0, bio: "森林狼由爱德华兹率领，正处于队史最具统治力和希望的阶段。" },
  "NOP": { championships: 0, bio: "鹈鹕队坐拥新奥尔良，是一支充满天赋和运动能力的青年军。" },
  "UTA": { championships: 0, bio: "犹他爵士以严明的执行力和坚固的高原主场优势闻名西部。" },
  "MEM": { championships: 0, bio: "灰熊队球风强硬，是一支充满斗志的“磨砺之城”队伍。" },
  
  "DEFAULT": { championships: 0, bio: "NBA 2025-26 赛季活跃成员球队。" }
};

const fixTeamAbbr = (abbr: string) => {
  const s = abbr.toLowerCase();
  if (s === 'nop') return 'no';
  if (s === 'uta') return 'utah';
  return s;
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const API_KEY = '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6';

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: { 'Authorization': API_KEY } });
        const data = await res.json();
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error(e); }
    }
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm relative">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="text-blue-500 underline underline-offset-8">Teams</Link>
          <Link href="/leaders" className="hover:text-white transition-colors">Leaders</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Bracket</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-40">
        {teams.map((t: any) => (
          <div key={t.id} onClick={() => setSelectedTeam(t)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative flex items-center justify-between">
            <div className="flex items-center gap-6 relative z-10">
              <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(t.abbreviation)}.png`} className="w-16 h-16 object-contain" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{t.full_name}</h3>
            </div>
            <span className="text-6xl font-black italic opacity-[0.02] absolute right-8 uppercase">{t.abbreviation}</span>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300 scrollbar-hide">
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-10 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-8">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(selectedTeam.abbreviation)}.png`} className="w-24 h-24" />
                  <div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 italic">Verified Roster • 2025-26 Season</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-light hover:bg-white hover:text-black transition-all">×</button>
            </div>

            <div className="p-12 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest border-l-4 border-blue-500 pl-4">Franchise Evolution</h4>
                  <p className="text-zinc-300 text-xl leading-relaxed italic font-medium">{TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY.DEFAULT.bio}</p>
                </div>
                <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 text-center flex flex-col justify-center shadow-inner">
                  <p className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic">Championships</p>
                  <p className="text-8xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-6 uppercase tracking-[0.2em]">NBA World Titles</p>
                </div>
              </div>

              <div className="space-y-10 pb-10 border-t border-zinc-900 pt-16">
                <h4 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest border-l-4 border-red-600 pl-4 text-white italic">Active 2025-26 Season Roster (15-Man)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(DETAILED_ROSTERS[selectedTeam.abbreviation] || []).map((p, i) => (
                    <div key={i} className="bg-[#1a1d23] p-6 rounded-2xl border border-zinc-800 hover:border-blue-500 transition-all flex items-center justify-between group shadow-xl">
                       <div className="flex items-center gap-5">
                          <span className="font-mono text-zinc-700 text-lg font-bold group-hover:text-blue-500 transition-colors italic">#{p.no}</span>
                          <p className="text-white font-black uppercase text-sm tracking-tighter italic font-black italic">{p.name}</p>
                       </div>
                       <span className="bg-zinc-800 text-zinc-500 text-[10px] px-3 py-1 rounded-full font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{p.pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-10 pt-0"><button onClick={() => setSelectedTeam(null)} className="w-full bg-zinc-800 py-8 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">Close Terminal Access</button></div>
          </div>
        </div>
      )}
    </div>
  );
}