// 模拟宝藏地图API
class TreasureMap {
  static getInitialClue() {
    return new Promise((resolve) => setTimeout(() => resolve("在图书馆发现了一张旧地图..."), 500));
  }

  static decodeAncientScript(clue) {
    return new Promise((resolve, reject) => setTimeout(() => clue ? resolve("地图上的古老文字显示宝藏位于一座神庙中...") : reject("无法解码古老文字!"), 800));
  }

  static encounterTempleGuard(location) {
    return new Promise((resolve, reject) => setTimeout(() => Math.random() < 0.8 ? resolve("成功说服守卫让你进入神庙...") : reject("守卫阻止了你进入神庙!"), 700));
  }

  static solveTemplePuzzle() {
    return new Promise((resolve, reject) => setTimeout(() => Math.random() < 0.9 ? resolve("成功解开神庙的谜题，发现了隐藏的通道!") : reject("解谜失败!你被困在神庙中..."), 600));
  }

  static enterHiddenPassage() {
    return new Promise((resolve) => setTimeout(() => resolve("你发现了通往宝藏的秘密房间..."), 500));
  }

  static openTreasureChest() {
    return new Promise((resolve) => setTimeout(() => resolve("恭喜!你找到了传说中的宝藏!"), 500));
  }
}

// 预加载所有图片
const imageSources = [
  "images/library.jpg",
  "images/ancient_script.jpg",
  "images/temple_search.jpg",
  "images/puzzle.jpg",
  "images/hidden_passage.jpg",
  "images/treasure.jpg",
  "images/guard.jpg"
];

const preloadedImages = {};

// 使用 Promise.all 提高预加载速度
async function preloadImages() {
  await Promise.all(
    imageSources.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        preloadedImages[src] = img;
        resolve();
      };
      img.src = src;
    }))
  );
}

// 优化后的显示图片函数
function showSceneImage(imageSrc) {
  const storyImage = document.getElementById('story-image');
  const img = preloadedImages[imageSrc];
  if (img) {
    storyImage.src = img.src;
    storyImage.style.display = "block";
  }
}

// 游戏主逻辑
async function findTreasureWithPromises() {
  const messageDiv = document.getElementById('message');
  const loadingDiv = document.getElementById('loading');

  loadingDiv.style.display = 'block';
  messageDiv.textContent = '你在图书馆里寻找线索...';
  showSceneImage("images/library.jpg");

  let clue = await TreasureMap.getInitialClue();
  loadingDiv.style.display = 'none';
  messageDiv.textContent = clue;
  createNextButton("解码地图上的文字", () => decodeAncientScript(clue));

  async function decodeAncientScript(clue) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你开始解码地图上的古老文字...';
    showSceneImage("images/ancient_script.jpg");
    let location = await TreasureMap.decodeAncientScript(clue);
    loadingDiv.style.display = 'none';
    messageDiv.textContent = location;
    createNextButton("前往神庙", () => encounterTempleGuard(location));
  }

  async function encounterTempleGuard(location) {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你在前往神庙的途中遇到了守卫...';
    showSceneImage("images/temple_search.jpg");
    showGuardImage();

    try {
      let access = await TreasureMap.encounterTempleGuard(location);
      loadingDiv.style.display = 'none';
      messageDiv.textContent = access;
      createNextButton("进入神庙", solveTemplePuzzle);
    } catch (error) {
      loadingDiv.style.display = 'none';
      messageDiv.textContent = "守卫阻止了你的进入!";
      createNextButton("再次尝试", () => encounterTempleGuard(location));
    }

    removeGuardImage();
  }

  async function solveTemplePuzzle() {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你进入了神庙，发现一个复杂的谜题...';
    showSceneImage("images/puzzle.jpg");
    try {
      let puzzleSolved = await TreasureMap.solveTemplePuzzle();
      loadingDiv.style.display = 'none';
      messageDiv.textContent = puzzleSolved;
      createNextButton("进入隐藏的通道", enterHiddenPassage);
    } catch (error) {
      loadingDiv.style.display = 'none';
      messageDiv.textContent = '解谜失败，神庙的大门关上了!';
      showSceneImage("images/guard.jpg");
      createNextButton("重新尝试解谜", solveTemplePuzzle);
    }
  }

  async function enterHiddenPassage() {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你发现了通往宝藏的通道...';
    showSceneImage("images/hidden_passage.jpg");
    let passage = await TreasureMap.enterHiddenPassage();
    loadingDiv.style.display = 'none';
    messageDiv.textContent = passage;
    createNextButton("打开宝藏箱", openTreasureChest);
  }

  async function openTreasureChest() {
    loadingDiv.style.display = 'block';
    messageDiv.textContent = '你找到了宝藏箱...';
    showSceneImage("images/treasure.jpg");
    let treasure = await TreasureMap.openTreasureChest();
    loadingDiv.style.display = 'none';
    messageDiv.textContent = treasure;
  }

  function createNextButton(buttonText, nextStep) {
    const existingButton = document.querySelector(".button");
    if (existingButton) existingButton.remove();

    const nextButton = document.createElement('button');
    nextButton.classList.add('button');
    nextButton.textContent = buttonText;
    nextButton.onclick = async () => {
      nextButton.remove();
      await nextStep();
    };
    document.body.appendChild(nextButton);
  }

  function showGuardImage() {
    removeGuardImage();

    const guardImage = document.createElement('img');
    guardImage.src = "images/guard.jpg";
    guardImage.classList.add("guard-image");
    guardImage.id = "guardImage";
    document.getElementById('game-container').appendChild(guardImage);
  }

  function removeGuardImage() {
    const guardImage = document.getElementById("guardImage");
    if (guardImage) guardImage.remove();
  }
}

// 页面加载后先预加载所有图片再启动游戏
document.getElementById('startBtn').addEventListener('click', async () => {
  document.getElementById('startBtn').style.display = "none";
  const loadingDiv = document.getElementById('loading');
  loadingDiv.style.display = 'block';
  await preloadImages(); // 预加载所有图片
  loadingDiv.style.display = 'none';
  await findTreasureWithPromises();
});
