/**
 * algocynfas.js: a library of routines for animating algorithms.
 * Created by Vainika and Prof. C on 12/01/17.
 */

const DEFAULT_DELAY = 1000;
const DEF_ELEM_HEIGHT = 60;
const DEF_ELEM_WIDTH = 60;
const PCT_FONT_BOX = .72;
const DEF_FONT = Math.floor(DEF_ELEM_HEIGHT * PCT_FONT_BOX);
const DEF_BG_COLOR = '#ffff99';
const DEF_HL_COLOR = '#99ccff';
const DEF_HLK_COLOR = '#0073e6';
const SWAP_COLOR = '#ffb380';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const CENTER = 'center';
const DEF_X = 40;
const DEF_Y = 40;
const HORIZ = 0;
const VERTICAL = 1;
const HashTableMargin = 10;


class DataElem {

  constructor(name = 'Data', key = null, shape = null, orientation = HORIZ) {
      this.name = name;
      this.key = key;
      this.shape = shape;
      this.delayTime = DEFAULT_DELAY;
      this.color = DEF_BG_COLOR;
      this.orientation = orientation;
  }

  draw(canvas, x, y, init=false) {
  }

  reOrder() {
  }

  getKey() {
    return this.key;
  }

  setDelay(newDelay) {
    this.delayTime = newDelay;
  }
}


class ListElem extends DataElem {

  constructor(key, shape = null) {
      super('ListElem', key, 'Rect');
      this.shape = this.setShape();
      this.group = this.setGroup(this.shape, this.setText(this.key),
          this.key);
  }

  draw(canvas, x, y, init=false) {
      this.shape.set('fill', this.color)
      this.group.left = x;
      this.group.top = y;
      if(init) {
        canvas.add(this.group);
      }
  }

  setShape() {
      return new fabric.Rect({
          fill: this.color,
          originX: CENTER,
          originY: CENTER,
          width: DEF_ELEM_WIDTH,
          height: DEF_ELEM_HEIGHT,
      });
  }

  setText(val) {
      return new fabric.Text(String(val),
              {fontSize: DEF_FONT, originX: CENTER, originY: CENTER});
  }

  setGroup(shape, dispText, id) {
      return new fabric.Group([ shape, dispText ],
              {angle: 0, id: id});
  }

  highlight() {
      this.setColor(DEF_HL_COLOR);
  }

  unhighlight() {
      this.setColor(DEF_BG_COLOR);
  }

  highlightSwap() {
      this.setColor(SWAP_COLOR);
  }

  setColor(color) {
      this.color = color;
  }

  reOrder() {
  }

}

class DataStructure extends DataElem {

  constructor(name, canvas) {
      super('DataStructure');
      this.dataElems = [];
      this.canvas = canvas;
  }

  insert(elem) {
      this.dataElems.push(elem);
  }

  elemAt(index) {
    return this.dataElems[index]
  }

  indexOf(key) {
      for (var i in this.dataElems) {
        if(this.dataElems[i].key === key) {
          return i;
        }
      }
      return -1;
  }

  remove(key) {
      var i = this.indexOf(key);
      // removing from the dataElems
      if(i >= 0) {
        this.dataElems.splice(i, 1)
      }
      //removing from the convas
      this.canvas.getObjects().map((node) => {
          node.id === key ? this.canvas.remove(node) : '';
      });
  }

  getDSPos() {
      return this.orientation === HORIZ ?
          (this.canvas.width / 2 - DEF_ELEM_WIDTH * (this.size() / 2)):
          this.canvas.height / 2 - DEF_ELEM_HEIGHT * (this.size() / 2);
  }

  positionElem(elemIndex) {
      return null;
  }

  size() {
      return this.dataElems.length;
  }

  swap(i, j) {
      var temp;
      temp = this.dataElems[i];
      this.dataElems[i] = this.dataElems[j];
      this.dataElems[j] = temp;
  }

  async pause (time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time)
      })
  }

  [Symbol.iterator]() {
      let index = 0;
      return {
          next: () => {
            let value = this.dataElems[index];
            let done = index >= this.dataElems.length;
            index++;
            return { value, done };
          }
      };
  };

// for debugging:
  iterator() {
      let iterator = this.dataElems[Symbol.iterator]();
      console.log(iterator.next());
      // for (let item, val of this.dataElems) {
      //     console.log(item, val);
      // }
  }
}

class List extends DataStructure {

  constructor(canvas, list = null) {
    
      super('List', canvas);
      this.list = list;
      this.setList(this.list);
  }

  setList(list) {
      for (var index in this.list) {
          super.insert(new ListElem(list[index]));
      }
  }

  positionElem(elemIndex) {
      return this.orientation == HORIZ ?
          [this.getDSPos() + (DEF_ELEM_WIDTH + 1) * elemIndex, DEF_Y]
            : [DEF_X, this.getDSPos() + (DEF_ELEM_HEIGHT + 1) * elemIndex];
  }

  async draw(init=false, orientation=HORIZ) {
      var x, y;
      if(init) {
          this.orientation = orientation;
      }
      for (var i in this.dataElems) {
          [x, y] = this.positionElem(i);
          await this.dataElems[i].draw(this.canvas, x, y, init);
      }
      this.canvas.renderAll();
      await super.pause(this.delayTime);
  }

  highlight(i, j=0) {
      var k = i;
      do {
        this.dataElems[k].highlight();
        k++;
      }
      while (k <= j);
  }

  unhighlight(i, j=0) {
      var k = i;
      do {
        this.dataElems[k].unhighlight();
        k++;
      }
      while (k <= j);
  }

  highlightSwap(i) {
      this.dataElems[i].highlightSwap();
  }

  async pause (time) {
      this.delayTime = time;
      await super.pause(this.delayTime);
  }
}


class HashTable extends List {


  constructor(canvas, list = null) {
      super(canvas, list);
      if(list!=null){
        for(var i=0; i<list.length; i++)
        {
          super.highlight(i);
        }
        var len = list.length; 
        this.HeadLists=[];
        while(len!=0){
            this.HeadLists.push([]);
            len-=1;
        }

      }
  }

  getDSPos() {
    return this.orientation === HORIZ ?
        (this.canvas.width / 2 - DEF_ELEM_WIDTH * (this.size() / 2)):HashTableMargin;
  }
  
  setHList(ListWHead_index, value){
    this.canvas.clear();
    super.draw(true,orientation=VERTICAL);
    this.HeadLists[ListWHead_index].push(value);
    for(var i=0; i<this.HeadLists.length;i++){
        if (this.HeadLists[i].length>14)
        {
          noticeErr("Sorry we are unable to handle these many items in one chain!");
        }
        createListWithHead(this.canvas,this.HeadLists[i], i);
    }
   
  }

    setHValue(ListWHead_index, value){
    this.canvas.clear();
    super.draw(true,orientation=VERTICAL);
    for(var i = ListWHead_index ; i<ListWHead_index+this.list.length ; i++)
    {
      if(this.HeadLists[i%(this.list.length)].length==0)
      {
          this.HeadLists[i%(this.list.length)].push(value);
          break;
      }
    }

    for(var i=0; i<this.HeadLists.length;i++){
        createListWithHead(this.canvas,this.HeadLists[i], i);
    }
   
  }
}

class ListWithHead extends List{
    constructor(canvas, list = null, head = 0 ){
        super(canvas,list);
        this.Head = head;
        this.line=new Line(); // draw a line between the hash indedx and the hashed values
        this.line.draw(this.canvas, 100, 15 + (head * (DEF_ELEM_HEIGHT + 1)) , true); //tried value to adjust the line position
    } 

    getDSPos() {
      return this.orientation === HORIZ ?
          150:
          this.canvas.height / 2 - DEF_ELEM_HEIGHT * (this.size() / 2);
  }

    positionElem(elemIndex) {
      return this.orientation == HORIZ ?
          [this.getDSPos() + (DEF_ELEM_WIDTH + 1) * elemIndex, (HashTableMargin+this.Head*(DEF_ELEM_HEIGHT + 1))]
            : [DEF_X, this.getDSPos() + (DEF_ELEM_HEIGHT + 1) * elemIndex];
  }


}

class Line extends ListElem{
  constructor() {
      super(" ");
  }

   draw(canvas, x, y, init=false) {
      this.shape.set('fill', "black")
      this.group.left = x;
      this.group.top = y;
      if(init) {
        canvas.add(this.group);
      }
  }

  setShape(){
       return new fabric.Rect({
          fill: DEF_HLK_COLOR,
          originX: CENTER,
          originY: CENTER,
          width: 40,
          height: 3,   
      });

    }
 
}
function createList(canvas, list) {
    l = new List(canvas, list);
    l.draw(true);
    return l;
}

function createHashTable(canvas, list) {
    l = new HashTable(canvas, list);
    l.draw(true, orientation=VERTICAL);
    return l;
}

function createListWithHead(canvas, list, head){
    l = new ListWithHead(canvas, list , head);
    l.draw(true);
    return l;
}

