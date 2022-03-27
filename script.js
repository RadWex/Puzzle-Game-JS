const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

var mouse = {};
var img;
var pieces = [];
var sceneSize;
var onePieceSize;
var currentPickedPiece;
var currentDropPiece;

function init(path) {
  img = new Image();
  img.addEventListener("load", imageLoaded, false);
  img.src = path;
}

function imageLoaded(e) {
  onePieceSize = Math.floor(img.width / 4);
  sceneSize = onePieceSize * 4;
  canvas.width = sceneSize;
  canvas.height = sceneSize;
  mouse.x = 0;
  mouse.y = 0;
  ctx.drawImage(img, 0, 0, sceneSize, sceneSize, 0, 0, sceneSize, sceneSize);
  ctx.drawImage(img, 0, 0, sceneSize, sceneSize, 0, 0, sceneSize, sceneSize);
  ctx.textAlign = "center";
  ctx.font = "bold 30px Calibri";
  ctx.fillStyle = "black";
  ctx.fillText("Click to start", sceneSize / 2, sceneSize / 2);
  divideIntoPieces();
}

function divideIntoPieces() {
  var piece;
  for (var i = 0; i < sceneSize; i += onePieceSize) {
    for (var j = 0; j < sceneSize; j += onePieceSize) {
      piece = {};
      piece.x = i;
      piece.y = j;
      pieces.push(piece);
    }
  }
  document.onmousedown = mixPuzzle;
}

function mixPuzzle() {
  pieces = shuffleArray(pieces);
  ctx.clearRect(0, 0, sceneSize, sceneSize);

  var piece;
  var k = 0;

  for (var i = 0; i < sceneSize; i += onePieceSize) {
    for (var j = 0; j < sceneSize; j += onePieceSize) {
      piece = pieces[k++];
      piece.xOryginal = j;
      piece.yOryginal = i;

      ctx.drawImage(
        img,
        piece.x,
        piece.y,
        onePieceSize,
        onePieceSize,
        j,
        i,
        onePieceSize,
        onePieceSize
      );
    }
  }
  document.onmousedown = pieceClicked;
}

function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function pieceClicked(e) {
  if (e.layerX || e.layerX == 0) {
    mouse.x = e.layerX;
    mouse.y = e.layerY;
  } else if (e.offsetX || e.offsetX == 0) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  }
  currentPickedPiece = checkWhichPiceClicked();
  if (currentPickedPiece != null) {
    ctx.clearRect(
      currentPickedPiece.xOryginal,
      currentPickedPiece.yOryginal,
      onePieceSize,
      onePieceSize
    );
    document.onmousemove = updateScene;
    document.onmouseup = pieceDropped;
  }
}

function checkWhichPiceClicked() {
  var piece;
  for (var i = 0; i < pieces.length; i++) {
    piece = pieces[i];
    if (
      mouse.x >= piece.xOryginal &&
      mouse.x <= piece.xOryginal + onePieceSize &&
      mouse.y >= piece.yOryginal &&
      mouse.y <= piece.yOryginal + onePieceSize
    ) {
      return piece;
    }
  }
  return null;
}

function updateScene(e) {
  currentDropPiece = null;
  if (e.layerX || e.layerX == 0) {
    mouse.x = e.layerX;
    mouse.y = e.layerY;
  } else if (e.offsetX || e.offsetX == 0) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  }
  ctx.clearRect(0, 0, sceneSize, sceneSize);
  var piece;
  for (var i = 0; i < pieces.length; i++) {
    piece = pieces[i];
    if (piece == currentPickedPiece) {
      continue;
    }
    ctx.drawImage(
      img,
      piece.x,
      piece.y,
      onePieceSize,
      onePieceSize,
      piece.xOryginal,
      piece.yOryginal,
      onePieceSize,
      onePieceSize
    );

    if (currentDropPiece == null) {
      if (
        mouse.x < piece.xOryginal ||
        mouse.x > piece.xOryginal + onePieceSize ||
        mouse.y < piece.yOryginal ||
        mouse.y > piece.yOryginal + onePieceSize
      ) {
      } else {
        currentDropPiece = piece;
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#001100";
        ctx.fillRect(
          currentDropPiece.xOryginal,
          currentDropPiece.yOryginal,
          onePieceSize,
          onePieceSize
        );
        ctx.restore();
      }
    }
  }
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.drawImage(
    img,
    currentPickedPiece.x,
    currentPickedPiece.y,
    onePieceSize,
    onePieceSize,
    mouse.x - onePieceSize / 2,
    mouse.y - onePieceSize / 2,
    onePieceSize,
    onePieceSize
  );
  ctx.restore();
}

function pieceDropped(e) {
  document.onmousemove = null;
  document.onmouseup = null;
  if (currentDropPiece != null) {
    var tmp = {
      xOryginal: currentPickedPiece.xOryginal,
      yOryginal: currentPickedPiece.yOryginal,
    };
    currentPickedPiece.xOryginal = currentDropPiece.xOryginal;
    currentPickedPiece.yOryginal = currentDropPiece.yOryginal;
    currentDropPiece.xOryginal = tmp.xOryginal;
    currentDropPiece.yOryginal = tmp.yOryginal;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
  ctx.clearRect(0, 0, sceneSize, sceneSize);
  var end = true;
  var piece;
  for (var i = 0; i < pieces.length; i++) {
    piece = pieces[i];
    ctx.drawImage(
      img,
      piece.x,
      piece.y,
      onePieceSize,
      onePieceSize,
      piece.xOryginal,
      piece.yOryginal,
      onePieceSize,
      onePieceSize
    );

    if (piece.xOryginal != piece.x || piece.yOryginal != piece.y) {
      end = false;
    }
  }
  if (end) {
    endGame();
  }
}

function endGame() {
  ctx.textAlign = "center";
  ctx.font = "bold 30px Calibri";
  ctx.fillStyle = "black";
  ctx.fillText("You won", sceneSize / 2, sceneSize / 2);
  document.onmousemove = null;
  document.onmouseup = null;
  document.onmousedown = null;
}
