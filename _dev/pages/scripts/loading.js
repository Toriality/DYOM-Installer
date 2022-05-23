export function buildStatus(author, name, missionFileName, sdFolderName) {
  const status = [
    {
      type: "name-author",
      data: [
        {
          probability: 1,
          strings: [`Making ${author} famous...`],
        },
        {
          probability: 0.1,
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
            `This mission is not bad...`,
          ],
        },
      ],
    },
    {
      type: "mission-pack",
      data: [
        {
          probability: 1,
          strings: [`Copying your mission files...`],
        },
        {
          probability: 0.2,
          strings: [`This looks better than Rebound...`],
        },
      ],
    },
    {
      type: "name-author-mp",
      data: [
        {
          probability: 1,
          strings: [`${name.toUpperCase()}, by ${author}...`],
        },
        {
          probability: 0.1,
          strings: [`This is the MP of the year...`],
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
          strings: [`Hans Zimmer would be proud of your OST...`],
        },
      ],
    },
    {
      type: "sd",
      data: [
        {
          probability: 1,
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
      ],
    },
    {
      type: "MachineGun",
      data: [
        {
          probability: 1,
          strings: [`Copying addon 'MachineGun'...`],
        },
        {
          probability: 0.2,
          strings: [
            `Put sentry here...`,
            `Buying ammo for minigun on eBay...`,
            `Robbing Uncle Sam...`,
            `Uh... a man with a lot of guns? Shit, I give up!...`,
          ],
        },
      ],
    },
    {
      type: "DarkEfect",
      data: [
        {
          probability: 1,
          strings: [`Copying addon 'DarkEffect'...`],
        },
        {
          probability: 0.2,
          strings: [
            `Who turned off the lights?...`,
            `Why are your missions so dark?...`,
            `I have a confesisonto make. I'm blind...`,
          ],
        },
      ],
    },
    {
      type: "WDynamites",
      data: [
        {
          probability: 1,
          strings: [`Copying 'WDynamites'...`],
        },
        {
          probability: 0.1,
          strings: [`Moving 'Working Dynamites', uh, this seems dangerous...`],
        },
      ],
    },
    {
      type: "RoadSpikes",
      data: [
        {
          probability: 1,
          strings: [`Copying 'RoadSpikes'...`],
        },
        {
          probability: 0.1,
          strings: [`Throwing spikes on the road...`],
        },
      ],
    },
    {
      type: "TeleportHealth",
      data: [
        {
          probability: 1,
          strings: [`Copying 'TeleportHealth'...`],
        },
        {
          probability: 0.01,
          strings: [`Why making hard missions? You're not M316...`],
        },
      ],
    },
    {
      type: "CCTV",
      data: [
        {
          probability: 1,
          strings: [`Copying 'CCTV'...`],
        },
        {
          probability: 0.1,
          strings: [`I'm always watching, or listening, or both...`],
        },
      ],
    },
    {
      type: "PhoneAnim",
      data: [
        {
          probability: 1,
          strings: [`Copying 'PhoneAnim'...`],
        },
        {
          probability: 0.2,
          strings: [
            `Ring, ring, ring, ring, ring. Banana phone...`,
            `Searching for the best ringtones on Napster...`,
          ],
        },
      ],
    },
    {
      type: "WeaponShops",
      data: [
        {
          probability: 1,
          strings: [`Copying 'WeaponShops'...`],
        },
        {
          probability: 0.1,
          strings: [`Buying weapons on Ammu-Nation...`],
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
      type: "installation-data",
      data: [
        {
          probability: 1,
          strings: [`Creating installation data...`],
        },
      ],
    },
    {
      type: "readme",
      data: [
        {
          probability: 1,
          strings: [`Writing README.txt for manual installations...`],
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
    {
      type: "processing",
      data: [
        {
          probability: 1,
          strings: [`Processing data...`],
        },
      ],
    },
    {
      type: "almost-done",
      data: [
        {
          probability: 1,
          strings: [`It's almost done...`],
        },
      ],
    },
    {
      type: "temp",
      data: [
        {
          probability: 1,
          strings: [`Done! Removing temp folder...`],
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
