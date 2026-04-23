const adjectives = [
  'Brave', 'Swift', 'Calm', 'Bold', 'Clever',
  'Keen', 'Noble', 'Witty', 'Bright', 'Steady',
  'Fierce', 'Gentle', 'Lucky', 'Proud', 'Quiet',
  'Sharp', 'Warm', 'Wild', 'Wise', 'Chill',
  'Daring', 'Eager', 'Lively', 'Mellow', 'Nimble',
  'Plucky', 'Radiant', 'Sincere', 'Tenacious', 'Upbeat',
  'Vibrant', 'Zealous', 'Agile', 'Bashful', 'Candid',
  'Diligent', 'Earnest', 'Fearless', 'Graceful', 'Humble',
  'Inventive', 'Jovial', 'Kindly', 'Loyal', 'Mindful',
  'Nifty', 'Observant', 'Patient', 'Quirky', 'Resilient',
  'Spirited', 'Thoughtful', 'Unique', 'Valiant', 'Whimsical',
  'Adventurous', 'Benevolent', 'Cheerful', 'Devoted', 'Elegant',
  'Focused', 'Generous', 'Harmonious', 'Inspired', 'Joyful',
  'Knightly', 'Luminous', 'Magnetic', 'Nurturing', 'Optimistic',
  'Passionate', 'Resolute', 'Serene', 'Tireless', 'Undaunted',
  'Versatile', 'Watchful', 'Assured', 'Brilliant', 'Cosmic',
  'Dynamic', 'Epic', 'Fiery', 'Gallant', 'Hearty',
  'Intrepid', 'Jubilant', 'Kingly', 'Legendary', 'Majestic',
  'Notable', 'Original', 'Poised', 'Regal', 'Savvy',
  'Stellar', 'Tactical', 'Unified', 'Vivid', 'Worthy',
];

const animals = [
  'Husky', 'Falcon', 'Otter', 'Wolf', 'Eagle',
  'Fox', 'Bear', 'Hawk', 'Lynx', 'Puma',
  'Dolphin', 'Raven', 'Tiger', 'Owl', 'Elk',
  'Panda', 'Shark', 'Cobra', 'Bison', 'Crane',
  'Jaguar', 'Penguin', 'Panther', 'Gazelle', 'Heron',
  'Badger', 'Osprey', 'Moose', 'Cougar', 'Sparrow',
  'Coyote', 'Pelican', 'Mantis', 'Marlin', 'Stork',
  'Condor', 'Marten', 'Oriole', 'Turtle', 'Gecko',
  'Ferret', 'Iguana', 'Jackal', 'Lemur', 'Macaw',
  'Narwhal', 'Ocelot', 'Parrot', 'Quail', 'Robin',
  'Salmon', 'Toucan', 'Urchin', 'Viper', 'Walrus',
  'Alpaca', 'Beetle', 'Chameleon', 'Dingo', 'Ermine',
  'Finch', 'Grouse', 'Hamster', 'Ibis', 'Jellyfish',
  'Kestrel', 'Lobster', 'Mongoose', 'Newt', 'Octopus',
  'Peacock', 'Rabbit', 'Starling', 'Tuna', 'Vulture',
  'Wombat', 'Bobcat', 'Cardinal', 'Donkey', 'Egret',
  'Flamingo', 'Gorilla', 'Hornet', 'Impala', 'Kingfish',
  'Leopard', 'Mustang', 'Nighthawk', 'Oyster', 'Python',
  'Raccoon', 'Seahorse', 'Termite', 'Unicorn', 'Wren',
  'Anchovy', 'Buffalo', 'Cicada', 'Dragonfly', 'Elephant',
];

const TOTAL_COMBOS = adjectives.length * animals.length;

function buildAllNames() {
  const names = [];
  for (const adj of adjectives) {
    for (const animal of animals) {
      names.push(`${adj} ${animal}`);
    }
  }
  return names;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let namePool = [];

async function generateAnonymousName(supabase) {
  if (namePool.length === 0) {
    const allNames = buildAllNames();

    const { data: usedRows } = await supabase
      .from('reviews')
      .select('display_name');

    const usedSet = new Set((usedRows || []).map((r) => r.display_name));

    const unused = allNames.filter((n) => !usedSet.has(n));

    if (unused.length > 0) {
      namePool = shuffle(unused);
    } else {
      namePool = shuffle(allNames);
    }
  }

  return namePool.pop();
}

module.exports = { generateAnonymousName };
