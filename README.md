# Segmented Data Anomaly Detection 
#### [CSE 498 Capstone Spring 2020](https://www.cse.msu.edu/~cse498/2020-01/projects/appdynamics/)
##### **Team Members**: Andres Columna, Caleb Jenkins,Titus Merriam, Aoija Rui, John Wagenmaker
[![GitHub release](https://img.shields.io/github/release/Homebrew/brew.svg)](https://github.com/aecolumna/appdynamics)

## Summary
Segmented Data Anomaly Detection leverages cluster analysis and unsupervised learning to explore performance anomalies across hundreds  of  performance  metrics,  leading  to  the  discovery  of  the specific  combinations  of  factors  that  are  leading  to  the  longest application response times.  Segmented Data Anomaly Detection uses Node.JS to pull data from the APM, and Scikit-learn running on Python to perform data analysis.  The  results  of  the  analysis  are  rendered  on  a  webapp, which includes data visualizations powered by D3.js.



## How to install?
1. Install Node

    <details>
     <summary><b>macOS</b></summary>
     <ol>
       <li>
         In the terminal, install XCode (developer tools built by Apple)  with
         <code>xcode-select --install</code>
       </li>
       <li>
         In the terminal, install Node and NPM with
         <code>brew install node</code>
       </li>
     </ol>
   </details>
   <details>
     <summary><b>Windows</b></summary>
     <ol>
       <li>
         Download the installer for the “current” version of Node from 
         <a href="https://nodejs.org/en/" target="_blank">
           their downloads page
         </a>
       </li>
       <li>
         Follow the instructions in the installer, without changing any options (unless you really know what you're doing)
       </li>
       <li>
         Restart your computer
       </li>
     </ol>
   </details>
   <details>
     <summary><b>Ubuntu</b></summary>
     <ol>
       <li>
         In the terminal, install some extra devtools with 
         <code>sudo apt-get install build-essential curl m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev</code>
       </li>
       <li>
         In the terminal, install Linuxbrew (a package manager for <em>more</em> developers tools on Linux) with
         <a href="http://linuxbrew.sh/" target="_blank">
           these instructions
         </a>
       </li>
       <li>
         In the terminal, install Node and NPM with
         <code>brew install node</code>
       </li>
     </ol>
   </details>
2. Install Yarn dependency manager by opening a terminal and running `npm install --global yarn`
3. then run `yarn install` to install all dependencies
4. Install [Anaconda 3.7+](https://www.anaconda.com/distribution/#download-section) Modules neccesary are:
<details>
<summary><b>Modules Needed</b></summary>
<ol>
<li>
Scikit-Learn
</li>
<li>
Pandas
</li>
<li> Numpy</li>
<li>Graphviz</li>
<li>
Seaborn
</li>
</ol>
</details>
5. in terminal, run `yarn run app`


## Questions
* for input or questions, please email columnaa@msu.edu
    

    

