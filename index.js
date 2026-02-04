import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const START_DATE = "2023-01-01";
const END_DATE = "2023-12-30";

const getNextGap = () => {
  const rand = Math.random() * 100;
  
  if (rand < 40) return 1;
  if (rand < 65) return 2;
  if (rand < 80) return 3;
  if (rand < 88) return 4;
  if (rand < 93) return 5;
  if (rand < 96) return 6;
  if (rand < 98) return 7;
  return random.int(8, 14);
};

const generateCommitDates = () => {
  const dates = [];
  const start = moment(START_DATE);
  const end = moment(END_DATE);
  
  let currentDate = start.clone();
  
  while (currentDate.isSameOrBefore(end)) {
    const commitsPerDay = random.int(7, 17);
    
    for (let i = 0; i < commitsPerDay; i++) {
      const commitTime = currentDate.clone()
        .add(random.int(0, 23), 'hours')
        .add(random.int(0, 59), 'minutes')
        .add(random.int(0, 59), 'seconds');
      
      dates.push(commitTime.format());
    }
    
    const gap = getNextGap();
    currentDate.add(gap, 'days');
  }
  
  return dates;
};

const makeCommits = (dates, index = 0) => {
  if (index >= dates.length) {
    return simpleGit().push().then(() => {
      console.log(`\nPush Success!`);
    }).catch((err) => {
      console.error(`\nPush failed:`, err);
    });
  }
  
  const date = dates[index];
  const data = { date: date };
  
  console.log(`[${index + 1}/${dates.length}] ${date}`);
  
  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(date, { "--date": date }, () => {
        makeCommits(dates, index + 1);
      });
  });
};

console.log(`Generating commit dates...`);

const commitDates = generateCommitDates();
makeCommits(commitDates);
