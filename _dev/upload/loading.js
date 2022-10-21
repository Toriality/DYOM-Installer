export function buildStatus(author, name, missionFileName, sdFolderName) {
  const status = [
    {
      type: "start",
      data: [
        {
          probability: 1,
          strings: [
            `Making ${author} famous...`,
            `Starting archive setup process...`,
          ],
        },
        {
          probability: 0.2,
          strings: [`Making ${name} the next MOTW winner...`],
        },
      ],
    },
    {
      type: "mission",
      data: [
        {
          probability: 1,
          strings: [`Copying ${missionFileName}...`],
        },
        {
          probability: 0.2,
          strings: [
            `Nice work! This mission is cool...`,
            `This mission is not so bad...`,
            `Killing the person...`,
            `Going to the next checkpoint...`,
          ],
        },
      ],
    },
    {
      type: "mp",
      data: [
        {
          probability: 1,
          strings: [`Copying your mission files...`],
        },
        {
          probability: 0.2,
          strings: [
            `Analyzing your well-written dialogues...`,
            `Playtesting the last mission...`,
            `Skipping some boring cutscenes...`,
          ],
        },
      ],
    },
    {
      type: "start-mp",
      data: [
        {
          probability: 1,
          strings: [`${name.toUpperCase()}, by ${author}...`],
        },
        {
          probability: 0.2,
          strings: [
            `This is the MP of the year...`,
            `This looks better than Katabasis...`,
            `This MP is harder than Rebound...`,
          ],
        },
      ],
    },
    {
      type: "sd-mp",
      data: [
        {
          probability: 1,
          strings: [`Copying your SD folders...`],
        },
        {
          probability: 0.1,
          strings: [`Hans Zimmer would be proud of your soundtrack...`],
        },
      ],
    },
    {
      type: "sd",
      data: [
        {
          probability: 1,
          strings: [`Copying SD/${sdFolderName} folder...`],
        },
        {
          probability: 0.2,
          strings: [`${sdFolderName} is a funny word...`],
        },
      ],
    },
    {
      type: "modloader",
      data: [
        {
          probability: 1,
          strings: ["Copying modloader folder..."],
        },
        {
          probability: 0.2,
          strings: ["Telling Aznkei how to properly download the mods..."],
        },
      ],
    },
    {
      type: "SAMP",
      data: [
        {
          probability: 1,
          strings: [`Copying SAMP objects...`],
        },
      ],
    },
    {
      type: "package",
      data: [
        {
          probability: 1,
          strings: [`Creating ${name}.zip`],
        },
      ],
    },
  ];

  return status;
}

export function randomTimeout() {
  // Returns a random integer from 600 to 3000:
  const randomMs = Math.floor(Math.random() * 3000) + 600;
  return new Promise((resolve) => setTimeout(resolve, randomMs));
}

export async function setStatus(type, project) {
  // Loading titles
  console.log(project);
  const status = buildStatus(
    project.info.author,
    project.info.name,
    project.mission.files,
    project.sd?.codes
  );
  const randomNumber = Math.random();
  let received = [];
  for (var i = 0; i < status.length; i++) {
    if (status[i].type === type) {
      for (var x = 0; x < status[i].data.length; x++) {
        var entry = status[i].data[x];
        if (randomNumber < entry.probability) {
          var stringsLength = entry.strings.length;
          var chosenString = Math.floor(Math.random() * stringsLength);
          received.push(entry.strings[chosenString]);
        }
      }
    }
  }
  const displayString = received[received.length - 1];
  document.getElementById("status").innerText = displayString;
  await randomTimeout();
}
