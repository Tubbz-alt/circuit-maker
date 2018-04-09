import Konva from 'konva';

import Connector from './Connector';
import Gate from './Gate';
import Input from './Input';

const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

const gateArray = [];
const booleanInputsArray = [];
const connectorsArray = [];
const gateWidth = 100;
const gateHeight = 100;
const booleanInputWidth = 50;
const booleanInputHeight = 50;

function connectConnectorToElement(connector, itemToConnect) {
  if (itemToConnect instanceof Input) {
    itemToConnect.setOutput(connector);
    connector.setInput(itemToConnect);
    console.log("Connected input")
  }
  else if (itemToConnect instanceof Gate) {
    connector.setOutput(itemToConnect);
    itemToConnect.setInput(connector);
    console.log("Connected output")
  }
}

const stage = new Konva.Stage({
  container: 'canvas',
  width: innerWidth,
  height: innerHeight,
});

const layer = new Konva.Layer();

function addTrueInput(x, y) {
  const group = new Konva.Group({
    draggable: true,
  });
  const rectWidth = booleanInputWidth;
  const rectHeight = booleanInputHeight;
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: rectWidth,
    height: rectHeight,
    fill: 'lightgreen',
    stroke: 'black',
    strokeWidth: 4,
  });

  const text = new Konva.Text({
    x: x + 15,
    y: y + rectHeight / 4,
    text: 'T',
    fontSize: 30,
    fontFamily: 'Comic Sans',
    fill: 'black',
  });

  group.add(rect);
  group.add(text);
  layer.add(group);
  booleanInputsArray.push({
    booleanInput: new Input(),
    konvaGroup: group,
  });
};

function addFalseInput(x, y) {
  const group = new Konva.Group({
    draggable: true,
  });
  const rectWidth = booleanInputWidth;
  const rectHeight = booleanInputHeight;
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: rectWidth,
    height: rectHeight,
    fill: 'lightgreen',
    stroke: 'black',
    strokeWidth: 4,
  });

  const text = new Konva.Text({
    x: x + 15,
    y: y + rectHeight / 4,
    text: 'F',
    fontSize: 30,
    fontFamily: 'Comic Sans',
    fill: 'black',
  });

  group.add(rect);
  group.add(text);
  layer.add(group);
  booleanInputsArray.push({
    booleanInput: new Input(),
    konvaGroup: group,
  });
};

function addAndGate(x, y) {
  const group = new Konva.Group({
    draggable: true,
  });
  const rectWidth = gateWidth;
  const rectHeight = gateHeight;
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: rectWidth,
    height: rectHeight,
    fill: 'orange',
    stroke: 'black',
    strokeWidth: 4,
  });

  const text = new Konva.Text({
    x: x + 15,
    y: y + rectHeight / 4,
    text: 'AND',
    fontSize: 30,
    fontFamily: 'Comic Sans',
    fill: 'black',
  });

  group.add(rect);
  group.add(text);
  layer.add(group);
  gateArray.push({
    gate: new Gate(),
    konvaGroup: group,
  });
};

function addOrGate(x, y) {
  const group = new Konva.Group({
    draggable: true,
  });
  const rectWidth = gateWidth;
  const rectHeight = gateHeight;
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: rectWidth,
    height: rectHeight,
    fill: 'skyblue',
    stroke: 'black',
    strokeWidth: 4,
  });

  const text = new Konva.Text({
    x: x + 30,
    y: y + rectHeight / 4,
    text: 'OR',
    fontSize: 30,
    fontFamily: 'Comic Sans',
    fill: 'black',
  });

  group.add(rect);
  group.add(text);
  layer.add(group);
  gateArray.push({
    gate: new Gate(),
    konvaGroup: group,
  });
};

function addConnector(x, y) {
  const group = new Konva.Group({
    draggable: true,
  });
  const rectWidth = 150;
  const rectHeight = 10;
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: rectWidth,
    height: rectHeight,
    fill: 'gray',
    stroke: 'black',
    strokeWidth: 4,
  });

  const connector = new Connector();
  connectorsArray.push({
    connector: connector,
    konvaGroup: group,
  });

  group.on("dragend", function (e) {
    const connectorX = group.getAbsolutePosition().x;
    const connectorY = group.getAbsolutePosition().y;

    const gateThatWasCollidedWith = gateArray.find((gateEntry) => {
      const konvaGroup = gateEntry.konvaGroup;
      const gatePos = konvaGroup.getAbsolutePosition();
      const gateX = gatePos.x;
      const gateY = gatePos.y;

      return detectRectangleCollision(gateX, gateY, gateWidth, gateHeight, connectorX, connectorY, rectWidth, rectHeight);
    });

    const booleanInputThatWasCollidedWith = booleanInputsArray.find((inputEntry) => {
      const konvaGroup = inputEntry.konvaGroup;
      const booleanInputPos = konvaGroup.getAbsolutePosition();
      const booleanInputX = booleanInputPos.x;
      const booleanInputY = booleanInputPos.y;

      return detectRectangleCollision(booleanInputX, booleanInputY, booleanInputWidth, booleanInputHeight, connectorX, connectorY, rectWidth, rectHeight);
    });

    if (booleanInputThatWasCollidedWith) {
      const booleanInput = booleanInputThatWasCollidedWith.booleanInput;
      connectConnectorToElement(connector, booleanInput);
      console.log(connector);
    }
    if (gateThatWasCollidedWith) {
      const gate = gateThatWasCollidedWith.gate;
      connectConnectorToElement(connector, gate);
    }

    console.log(gateThatWasCollidedWith);
    console.log(booleanInputThatWasCollidedWith);

    group.moveToBottom();
  });
  group.add(rect);
  layer.add(group);
}

function detectRectangleCollision(itemPosX, itemPosY, itemWidth, itemHeight, connectorPosX, connectorPosY, connectorWidth, connectorHeight) {
  console.log(itemPosX, itemPosY, itemWidth, itemHeight, connectorPosX, connectorPosY, connectorWidth, connectorHeight);
  return (itemPosX < connectorPosX + connectorWidth &&
    itemPosX + itemWidth > connectorPosX &&
    itemPosY < connectorPosY + connectorHeight &&
    itemHeight + itemPosY > connectorPosY);
}

function trueInputClick() {
  addTrueInput(0, 0);
  stage.add(layer);
}

function falseInputClick() {
  addFalseInput(0, 0);
  stage.add(layer);
}

function andGateClick() {
  addAndGate(0, 0);
  stage.add(layer);
}

function orGateClick() {
  addOrGate(0, 0);
  stage.add(layer);
}

function connectorClick() {
  addConnector(0, 0);
  stage.add(layer);
}

window.trueInputClick = trueInputClick;
window.falseInputClick = falseInputClick;
window.andGateClick = andGateClick;
window.orGateClick = orGateClick;
window.connectorClick = connectorClick;
