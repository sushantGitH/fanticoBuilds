import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("tiles")
export class tiles extends Component {
  @property(Node)
  labelNode: Node = null!;

  private tileNumber: Number = null;

  @property
  distance = 10;

  private _lastWPos: Vec3 = new Vec3();
  private _pos: Vec3 = new Vec3();

  private gamePlayRef = null;

  private isLadderType = false;
  private isSnakeType = false;
  private endpointTileNumber = -1;

  start() {}

  initialiseNumber(number: number, gameRef, tilesConfig) {
    this.gamePlayRef = gameRef;
    this.tileNumber = number;

    this.initialiseTileType(tilesConfig);
  }

  initialiseTileType(tilesConfig){
    for (let i = 0; i < tilesConfig.length; i++) {
      if(tilesConfig[i].tileNumber == this.tileNumber)
      {
        (tilesConfig[i].tileType == "Ladder") ? this.isLadderType = true : this.isSnakeType = true;
        this.endpointTileNumber = tilesConfig[i].endpointTileNumber;
        return;
      }
      
    }
  }

  checkIsladderType(){
    return this.isLadderType;
  }

  checkIsSnakeType(){
    return this.isSnakeType;
  }

  getEndpointNumber(){
    return this.endpointTileNumber;
  }

  update() {
    return;
    const wpos = this.node.worldPosition;
    // @ts-ignore
    if (!this.gamePlayRef.camera!._camera || this._lastWPos.equals(wpos)) {
        return;
    }

    this._lastWPos.set(wpos);
    const camera = this.gamePlayRef.camera!;
    // [HACK]
    // @ts-ignore
    camera._camera.update();
    camera.convertToUINode(wpos, this.labelNode.parent!, this._pos);
    this.labelNode.setPosition(this._pos);
    // @ts-ignore
    Vec3.transformMat4(this._pos, this.node.worldPosition, camera._camera!.matView);

    const ratio = 10 / Math.abs(this._pos.z);

    const value = Math.floor(ratio * 100) / 100;
    this.labelNode.setScale(value, value, 1);
  }

  getNumber() {
    return this.tileNumber;
  }
}
