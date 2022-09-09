import {
  _decorator,
  Component,
  Node,
  Prefab,
  Vec3,
  tween,
  Label,
  instantiate,
  Camera,
  Button,
} from "cc";
import { pawn } from "./custom/pawn";
import { tiles } from "./custom/tiles";
const { ccclass, property } = _decorator;

// @ccclass("tiles")
// export default class tiles {
//     @property(Node)
//     public tile: Node = null;

//     @property(Number)
//     tileNumber: Number = 0;
// }

@ccclass("gameplay")
export class gameplay extends Component {
  @property({ type: Label })
  public label: Label = null;

  public tilesArray = [];
  public pawnArray = [];
  public currentTurn = 0;

  @property({ type: Node })
  public diceBtn: Node = null;

  @property({ type: Node })
  public pawnLabel: Node = null;

  @property({ type: Prefab })
  public tile: Prefab = null;

  @property({ type: Prefab })
  public pawnPrefab: Prefab = null;

  @property({ type: Node })
  public cameraBase: Node = null;

  @property(Camera)
  camera: Camera = null!;

  start() {
    this.loadTiles();

    this.loadPawns();
  }

  update(deltaTime: number) {}

  loadPawns(){

    var pawnName = ["vinay", "sushant"];
    for (let i = 0; i < 2; i++) {
      let pawn = instantiate(this.pawnPrefab);
      (pawn.getComponent("pawn") as pawn).initialisePawn(this ,pawnName[i]);
      this.node.parent.addChild(pawn);
      this.pawnArray.push(pawn);
    }
  }

  loadTiles() {

    var tilesConfig = [
      {
        tileNumber : 4,
        tileType : "Ladder",
        endpointTileNumber : 14,
      },
      {
        tileNumber : 9,
        tileType : "Ladder",
        endpointTileNumber : 31,
      },
      {
        tileNumber : 17,
        tileType : "Snake",
        endpointTileNumber : 7,
      },
      {
        tileNumber : 21,
        tileType : "Ladder",
        endpointTileNumber : 42,
      },
      {
        tileNumber : 28,
        tileType : "Ladder",
        endpointTileNumber : 84,
      },
      {
        tileNumber : 51,
        tileType : "Ladder",
        endpointTileNumber : 67,
      },
      {
        tileNumber : 54,
        tileType : "Snake",
        endpointTileNumber : 34,
      },
      {
        tileNumber : 64,
        tileType : "Snake",
        endpointTileNumber : 60,
      },
      {
        tileNumber : 71,
        tileType : "Ladder",
        endpointTileNumber : 91,
      },
      {
        tileNumber : 80,
        tileType : "Ladder",
        endpointTileNumber : 100,
      },
      {
        tileNumber : 87,
        tileType : "Snake",
        endpointTileNumber : 24,
      },
      {
        tileNumber : 93,
        tileType : "Snake",
        endpointTileNumber : 73,
      },
      {
        tileNumber : 95,
        tileType : "Snake",
        endpointTileNumber : 75,
      },
      {
        tileNumber : 98,
        tileType : "Snake",
        endpointTileNumber : 79,
      },
    ]


    let Xpositions = [-5.384,-4.174,-3.007,-1.806,-0.607,0.562,1.768,2.95,4.153,5.336];
    let Zpositions = [5.364,4.17,2.976,1.789,0.6,-0.614,-1.794,-2.976,-4.173,-5.368];
    let yposition = 0.238;
    let val = 1;
    let xVal = -1;
    let yVal = 0;
    for (let i = 0; i < 100; i++) {
      if (i % 10 == 0 && i != 0) {
        xVal = xVal+val; 
        val = val * -1; 
        yVal++;
      }
      xVal = xVal+val;
      let tile = instantiate(this.tile);
      tile.setPosition(new Vec3(Xpositions[xVal], yposition, Zpositions[yVal]));
      this.node.parent.addChild(tile);

      (tile.getComponent("tiles") as tiles).initialiseNumber(i + 1, this, tilesConfig);
      this.tilesArray.push(tile);
    }
  }

  onClick() {
    this.diceBtn.getComponent(Button).interactable = false;

    let randomNumber = Math.floor(Math.random() * 6) + 1;
    this.label.string = randomNumber.toString();

    if(this.currentTurn >= this.pawnArray.length)
      this.currentTurn = 0;

    let pawn = this.pawnArray[this.currentTurn];
    let pawnScript = pawn.getComponent("pawn") as pawn;
    pawnScript.setNewLocation(randomNumber);

    this.currentTurn++;
  }

  resetButton(){
    this.diceBtn.getComponent(Button).interactable = true;
  }
}
