import { _decorator, Component, Node, tween, Vec3, SkeletalAnimation, Vec2, instantiate, director, Label } from "cc";
import { tiles } from "./tiles";
const { ccclass, property } = _decorator;

const _tempPos = new Vec3();
const _tempDelta = new Vec2();
const Horizontal = new Vec2(1, 0);

@ccclass("pawn")
export class pawn extends Component {
  public currentNumber = 1;
  public destinationNumber = 1;

  private gamePlayRef = null;

  private labelNode = null;

  private _animComp: SkeletalAnimation = null!;
  private _animState = 'idle';

  private _lastWPos: Vec3 = new Vec3();
  private _pos: Vec3 = new Vec3();

  private cameraInitialPos:Vec3 = new Vec3(0 , 8.447 , 12.09);

  private myTurn = false;
  start() {
    this._animComp = this.node.getChildByName("Cocos").getComponent(SkeletalAnimation)!;
  }

  update(deltaTime: number) {
    if(this.myTurn)
      this.gamePlayRef.cameraBase.setPosition(new Vec3(this.node.position.x,5.781,this.node.position.z+4));

      if(this.labelNode != null)
      {
        const wpos = new Vec3(this.node.worldPosition.x,this.node.worldPosition.y + 0,this.node.worldPosition.z); //this.node.worldPosition;
        // // @ts-ignore
        // if (!this.gamePlayRef.camera!._camera || this._lastWPos.equals(wpos)) {
        //     return;
        // }
    
        this._lastWPos.set(wpos);
        const camera = this.gamePlayRef.camera!;
        // [HACK]
        // @ts-ignore
        camera._camera.update();
        camera.convertToUINode(wpos, this.labelNode.parent!, this._pos);
        this.labelNode.setPosition(this._pos);
        // @ts-ignore
        Vec3.transformMat4(this._pos, this.node.worldPosition, camera._camera!.matView);
    
        const ratio = 5 / Math.abs(this._pos.z);
    
        const value = Math.floor(ratio * 100) / 100;
        this.labelNode.setScale(value, value, 1);
      }
    
  }

  initialisePawn(gameRef, name) {
    this.gamePlayRef = gameRef;

    this.labelNode = instantiate(this.gamePlayRef.pawnLabel);
    this.labelNode.getChildByName("txt").getComponent(Label).string = name;
    this.gamePlayRef.node.addChild(this.labelNode);
    this.labelNode.active = true;

    this.initialisePawnLocation();
  }

  initialisePawnLocation() {
    this.node.setPosition(
      new Vec3(
        this.gamePlayRef.tilesArray[0].position.x,
        this.node.position.y,
        this.gamePlayRef.tilesArray[0].position.z
      )
    );
  }

  setNewLocation(destinationNumber) {

    if(this.destinationNumber+destinationNumber > 100)
      return;
    this.destinationNumber = this.destinationNumber+destinationNumber;

    this.moveCameraToPawn();
    return;
  }

  moveCameraToPawn(){
    let tweenDuration: number = 1.0;                            // Duration of the tween
    tween(this.gamePlayRef.cameraBase)
        .to(tweenDuration, { position: new Vec3(this.node.position.x,5.781,this.node.position.z+4) }, {  // 
            easing: "sineIn", 
            onComplete: (target?: object) => { 
              this.myTurn = true;
              this.checkDestinationReached();
            },
        })
        .start(); 
  }

  moveCameraOutside(){
    let tweenDuration: number = 1.0;                            // Duration of the tween
    tween(this.gamePlayRef.cameraBase)
        .to(tweenDuration, { position: this.cameraInitialPos }, {  // 
            easing: "sineOut", 
            onComplete: (target?: object) => { 
              this.gamePlayRef.resetButton();
            },
        })
        .start(); 
  }

  checkDestinationReached() {
    if (this.currentNumber == this.destinationNumber) {
      this.changeState('cocos_anim_idle');
      this.checkIfDestinationIsSomeSpecialTile();
      return;
    }
    if (this.currentNumber > this.destinationNumber) 
      this.currentNumber--;
    else 
      this.currentNumber++;

    this.movePawn(this.currentNumber);
  }

  checkIfDestinationIsSomeSpecialTile(){
    for (let i = 0; i < this.gamePlayRef.tilesArray.length; i++) {
      let tile = this.gamePlayRef.tilesArray[i];
      let tileScript = (tile.getComponent("tiles") as tiles);
      if (tileScript.getNumber() == this.currentNumber){
        if(tileScript.checkIsladderType() || tileScript.checkIsSnakeType())
        {
          this.startLadderAnimation(tileScript.getEndpointNumber());
          return;
        }

        break;
      }
    }
    
    this.myTurn = false;
    this.moveCameraOutside();
  }

  startLadderAnimation(endTileNumber){
    this.destinationNumber = endTileNumber;
    this.currentNumber = endTileNumber;

    this.movePawn(this.currentNumber);
  }

  movePawn(currentNumber: number) {
    var tile;
    this.changeState('cocos_anim_run');
    for (let i = 0; i < this.gamePlayRef.tilesArray.length; i++) {
      tile = this.gamePlayRef.tilesArray[i];
      if ((tile.getComponent("tiles") as tiles).getNumber() == currentNumber)
        break;
    }

    // if(this.node.position.z > tile.position.z)
    //   Vec2.subtract(_tempDelta, this.node.position, tile.position);
    // else
    //   Vec2.subtract(_tempDelta, tile.position, this.node.position);
    // console.log("-->",this.node.position);
    // console.log("--sssssss>",tile.position);
    // // 计算角色的整体旋转值
    // const deltaRadian = _tempDelta.angle(Horizontal);
    // const angle = deltaRadian * 180 / Math.PI;
    // const rot = this.node.getChildByName("Cocos").eulerAngles;
    // _tempPos.set(rot.x,90 + (Math.sign(_tempDelta.y)) * angle, rot.z);
    // this.node.getChildByName("Cocos").eulerAngles = _tempPos;

    let mod = -1;
    let angle = Math.atan2( this.node.position.z - tile.position.z, this.node.position.x - tile.position.x ) * ( 180 / Math.PI );
    const rot = this.node.getChildByName("Cocos").eulerAngles;
    _tempPos.set(rot.x,(90 + angle)*mod, rot.z);
    this.node.getChildByName("Cocos").eulerAngles = _tempPos;


    tween(this.node)
      .to(1.0, {
        position: new Vec3(
          tile.position.x,
          this.node.position.y,
          tile.position.z
        ),
      })
      .call(() => {
        this.checkDestinationReached();
      })
      .start();
  }

  changeState(name: string){
      if(this._animState === name){
          return;
      }

      this._animComp.play(name);
      this._animState = name;
  }
}
