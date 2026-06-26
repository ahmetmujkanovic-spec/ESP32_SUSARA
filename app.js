const client = mqtt.connect(
"wss://f061290ac3f24bb7a4bd389b716bddc6.s1.eu.hivemq.cloud:8884/mqtt",
{
  username:"esp32",
  password:"1234Aaaa",
  reconnectPeriod:2000
}
);

// dynamic storage
const dryers = {};

// create UI
function createDryer(id){

  const card=document.createElement("div");
  card.className="card";
  card.id="dryer_"+id;

  card.innerHTML=`
    <div class="title">SUŠARA ${id}</div>

    <div class="big" id="temp_${id}">-- °C</div>
    <div class="small" id="status_${id}">WAITING DATA</div>

    <div class="bar">
      <div class="fill" id="fill_${id}"></div>
    </div>
  `;

  document.getElementById("grid").appendChild(card);

  dryers[id]={
    last:Date.now(),
    temp:0
  };
}

// update logic
function updateDryer(id,temp,field){

  if(!dryers[id]) createDryer(id);

  const d=dryers[id];
  d.last=Date.now();

  if(field==="delta"){
    d.temp=temp;

    document.getElementById("temp_"+id).innerHTML=temp.toFixed(1)+" °C";

    let fill=document.getElementById("fill_"+id);

    let pct=Math.min(Math.max(temp,0),100);
    fill.style.width=pct+"%";

    if(temp>65){
      fill.style.background="#ff3333";
      document.getElementById("dryer_"+id).classList.add("alarm");
      document.getElementById("status_"+id).innerHTML="ALARM";
    }
    else{
      fill.style.background="#00ff99";
      document.getElementById("dryer_"+id).classList.remove("alarm");
      document.getElementById("status_"+id).innerHTML="OK";
    }
  }
}

// MQTT
client.on("connect",()=>{
  document.getElementById("mqttStatus").innerHTML="MQTT: CONNECTED";

  client.subscribe("susara/+/delta");
});

client.on("message",(topic,msg)=>{

  let parts=topic.split("/");
  let id=parts[1];
  let field=parts[2];

  let val=parseFloat(msg.toString());

  updateDryer(id,val,field);
});

// offline check every 2 min
setInterval(()=>{

  let now=Date.now();

  for(let id in dryers){

    let d=dryers[id];
    let el=document.getElementById("dryer_"+id);

    if(now-d.last > 120000){
      el.classList.add("offline");
    }else{
      el.classList.remove("offline");
    }
  }

},10000);
