
  };
  //Implementation of functions from break_eternity.js
  P.iteratedexp=function (other,payload){
    return this.tetr(other,payload);
  };
  Q.iteratedexp=function (x,y,payload){
    return new OmegaNum(x).iteratedexp(other,payload);
  };
  //This implementation is highly inaccurate and slow, and probably be given custom code
  P.iteratedlog=function (base,other){
    if (base===undefined) base=10;
    if (other===undefined) other=OmegaNum.ONE.clone();
    var t=this.clone();
    if (other.eq(ExpantaNum.ZERO)) return t;
    if (other.eq(ExpantaNum.ONE)) return t.logBase(base);
    base=new OmegaNum(base);
    other=new OmegaNum(other);
    return base.tetr(t.slog(base).sub(other));
  };
  Q.iteratedlog=function (x,y,z){
    return new OmegaNum(x).iteratedlog(y,z);
  };
  P.layeradd=function (other,base){
    if (base===undefined) base=10;
    if (other===undefined) other=OmegaNum.ONE.clone();
    var t=this.clone();
    base=new OmegaNum(base);
    other=new OmegaNum(other);
    return base.tetr(t.slog(base).add(other));
  };
  Q.layeradd=function (x,y,z){
    return new OmegaNum(x).layeradd(y,z);
  };
  P.layeradd10=function (other){
    return this.layeradd(other);
  };
  Q.layeradd10=function (x,y){
    return new OmegaNum(x).layeradd10(y);
  };
  //End implementation from break_eternity.js
  //All of these are from Patashu's break_eternity.js
  //The super square-root function - what number, tetrated to height 2, equals this?
  //Other sroots are possible to calculate probably through guess and check methods, this one is easy though.
  //https://en.wikipedia.org/wiki/Tetration#Super-root
  P.ssqrt=P.ssrt=function (){
    var x=this.clone();
    if (x.lt(Math.exp(-1/Math.E))) return OmegaNum.NaN.clone();
    if (!x.isFinite()) return x;
    if (x.gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(OmegaNum.EE_MAX_SAFE_INTEGER)){
      x.array[1]--;
      return x;
    }
    var l=x.ln();
    return l.div(l.lambertw());
  };
  Q.ssqrt=Q.ssrt=function (x){
    return new OmegaNum(x).ssqrt();
  };
  //Super-logarithm, one of tetration's inverses, tells you what size power tower you'd have to tetrate base to to get number. By definition, will never be higher than 1.8e308 in break_eternity.js, since a power tower 1.8e308 numbers tall is the largest representable number.
  //Uses linear approximation
  //https://en.wikipedia.org/wiki/Super-logarithm
  P.slog=function (base){
    if (base===undefined) base=10;
    var x=new OmegaNum(this);
    base=new OmegaNum(base);
    if (x.isNaN()||base.isNaN()||x.isInfinite()&&base.isInfinite()) return OmegaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (base.isInfinite()) return OmegaNum.ZERO.clone();
    if (x.lt(OmegaNum.ZERO)) return OmegaNum.ONE.neg();
    if (x.eq(OmegaNum.ONE)) return OmegaNum.ZERO.clone();
    if (x.eq(base)) return OmegaNum.ONE.clone();
    if (base.lt(Math.exp(1/Math.E))){
      var a=OmegaNum.tetr(base,Infinity);
      if (x.eq(a)) return OmegaNum.POSITIVE_INFINITY.clone();
      if (x.gt(a)) return OmegaNum.NaN.clone();
    }
    if (x.max(base).gt("10^^^"+MAX_SAFE_INTEGER)){
      if (x.gt(base)) return x;
      return OmegaNum.ZERO.clone();
    }
    if (x.max(base).gt(OmegaNum.TETRATED_MAX_SAFE_INTEGER)){
      if (x.gt(base)){
        x.array[2]--;
        x.standardize();
        return x.sub(x.array[1]);
      }
      return OmegaNum.ZERO.clone();
    }
    var r=0;
    var t=(x.array[1]||0)-(base.array[1]||0);
    if (t>3){
      var l=t-3;
      r+=l;
      x.array[1]=x.array[1]-l;
    }
    for (var i=0;i<100;++i){
      if (x.lt(OmegaNum.ZERO)){
        x=OmegaNum.pow(base,x);
        --r;
      }else if (x.lte(1)){
        return new OmegaNum(r+x.toNumber()-1);
      }else{
        ++r;
        x=OmegaNum.logBase(x,base);
      }
    }
    if (x.gt(10))
    return new OmegaNum(r);
  };
  Q.slog=function (x,y){
    return new OmegaNum(x).slog(y);
  };
  //end break_eternity.js excerpt
  P.pentate=P.pent=function (other){
    return this.arrow(3)(other);
  };
  Q.pentate=Q.pent=function (x,y){
    return OmegaNum.arrow(x,3,y);
  };
  //Uses linear approximations for real height
  P.arrow=function (arrows){
    var t=this.clone();
    arrows=new OmegaNum(arrows);
    if (!arrows.isint()||arrows.lt(OmegaNum.ZERO)) return function(other){return OmegaNum.NaN.clone();};
    if (arrows.eq(OmegaNum.ZERO)) return function(other){return t.mul(other);};
    if (arrows.eq(OmegaNum.ONE)) return function(other){return t.pow(other);};
    if (arrows.eq(2)) return function(other){return t.tetr(other);};
    return function (other){
      other=new OmegaNum(other);
      if (OmegaNum.debug>=OmegaNum.NORMAL) console.log(t+"{"+arrows+"}"+other);
      if (other.lt(OmegaNum.ZERO)) return OmegaNum.NaN.clone();
      if (other.eq(OmegaNum.ZERO)) return OmegaNum.ONE.clone();
      if (other.eq(OmegaNum.ONE)) return t.clone();
      if (arrows.gte(OmegaNum.maxArrow)){
        console.warn("Number too large to reasonably handle it: tried to "+arrows.add(2)+"-ate.");
        return OmegaNum.POSITIVE_INFINITY.clone();
      }
      if (other.eq(2)) return t.arrow(arrows-1)(t);
      if (t.max(other).gt("10{"+arrows.add(OmegaNum.ONE)+"}"+MAX_SAFE_INTEGER)) return t.max(other);
      var r;
      if (t.gt("10{"+arrows+"}"+MAX_SAFE_INTEGER)||other.gt(OmegaNum.MAX_SAFE_INTEGER)){
        if (t.gt("10{"+arrows+"}"+MAX_SAFE_INTEGER)){
          r=t.clone();
          r.array[arrows]--;
          r.standardize();
        }else if (t.gt("10{"+arrows.sub(OmegaNum.ONE)+"}"+MAX_SAFE_INTEGER)){
          r=new OmegaNum(t.array[arrows.sub(OmegaNum.ONE)]);
        }else{
          r=OmegaNum.ZERO;
        }
        var j=r.add(other);
        j.array[arrows]=(other.array[arrows]||0)+1;
        j.standardize();
        return j;
      }
      var y=other.toNumber();
      var f=Math.floor(y);
      r=t.arrow(arrows.sub(1))(y-f);
      for (var i=0,m=new OmegaNum("10{"+arrows.sub(OmegaNum.ONE)+"}"+MAX_SAFE_INTEGER);f!==0&&r.lt(m)&&i<100;++i){
        if (f>0){
          r=t.arrow(arrows.sub(OmegaNum.ONE))(r);
          --f;
        }
      }
      if (i==100) f=0;
      r.array[arrows.sub(OmegaNum.ONE)]=(r.array[arrows.sub(OmegaNum.ONE)]+f)||f;
      r.standardize();
      return r;
    };
  };
  P.chain=function (other,arrows){
    return this.arrow(arrows)(other);
  };
  Q.arrow=function (x,z,y){
    return new OmegaNum(x).arrow(z)(y);
  };
  Q.chain=function (x,y,z){
    return new OmegaNum(x).arrow(z)(y);
  };
  Q.hyper=function (z){
    z=new OmegaNum(z);
    if (z.eq(OmegaNum.ZERO)) return function(x,y){return new OmegaNum(y).eq(OmegaNum.ZERO)?new OmegaNum(x):new OmegaNum(x).add(OmegaNum.ONE);};
    if (z.eq(OmegaNum.ONE)) return function(x,y){return OmegaNum.add(x,y);};
    return function(x,y){return new OmegaNum(x).arrow(z.sub(2))(y);};
  };
  // All of these are from Patashu's break_eternity.js
  Q.affordGeometricSeries = function (resourcesAvailable, priceStart, priceRatio, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new OmegaNum(resourcesAvailable);
    priceStart=new OmegaNum(priceStart);
    priceRatio=new OmegaNum(priceRatio);
    var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
    return OmegaNum.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(OmegaNum.ONE)).add(OmegaNum.ONE).log10().div(priceRatio.log10()));
  };
  Q.affordArithmeticSeries = function (resourcesAvailable, priceStart, priceAdd, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new OmegaNum(resourcesAvailable);
    priceStart=new OmegaNum(priceStart);
    priceAdd=new OmegaNum(priceAdd);
    currentOwned=new OmegaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));
    var b = actualStart.sub(priceAdd.div(2));
    var b2 = b.pow(2);
    return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
  };
  Q.sumGeometricSeries = function (numItems, priceStart, priceRatio, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    priceStart=new OmegaNum(priceStart);
    priceRatio=new OmegaNum(priceRatio);
    return priceStart.mul(priceRatio.pow(currentOwned)).mul(OmegaNum.sub(OmegaNum.ONE, priceRatio.pow(numItems))).div(OmegaNum.sub(OmegaNum.ONE, priceRatio));
  };
  Q.sumArithmeticSeries = function (numItems, priceStart, priceAdd, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    numItems=new OmegaNum(numItems);
    priceStart=new OmegaNum(priceStart);
    currentOwned=new OmegaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));

    return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(OmegaNum.ONE).mul(priceAdd)));
  };
  // Binomial Coefficients n choose k
  Q.choose = function (n, k) {
    /*
      If you have n items and you take k out,
      how many ways could you do this?
    */
    return new OmegaNum(n).factorial().div(new OmegaNum(k).factorial().mul(new OmegaNum(n).sub(new OmegaNum(k)).factorial()));
  };
  P.choose = function (other) {
    return OmegaNum.choose(this, other);
  };
  //end break_eternity.js excerpt
  P.standardize=function (){
    var b;
    var x=this;
    if (OmegaNum.debug>=OmegaNum.ALL) console.log(x.toString());
    if (!x.array||!x.array.length) x.array=[0];
    if (x.sign!=1&&x.sign!=-1){
      if (typeof x.sign!="number") x.sign=Number(x.sign);
      x.sign=x.sign<0?-1:1;
    }
    for (var l=x.array.length,i=0;i<l;i++){
      var e=x.array[i];
      if (e===null||e===undefined){
        x.array[i]=0;
        continue;
      }
      if (isNaN(e)){
        x.array=[NaN];
        return x;
      }
      if (!isFinite(e)){
        x.array=[Infinity];
        return x;
      }
      if (i!==0&&!Number.isInteger(e)) x.array[i]=Math.floor(e);
    }
    do{
      if (OmegaNum.debug>=OmegaNum.ALL) console.log(x.toString());
      b=false;
      while (x.array.length&&x.array[x.array.length-1]===0){
        x.array.pop();
        b=true;
      }
      if (x.array[0]>MAX_SAFE_INTEGER){
        x.array[1]=(x.array[1]||0)+1;
        x.array[0]=Math.log10(x.array[0]);
        b=true;
      }
      while (x.array[0]<MAX_E&&x.array[1]){
        x.array[0]=Math.pow(10,x.array[0]);
        x.array[1]--;
        b=true;
      }
      if (x.array.length>2&&!x.array[1]){
        for (i=2;!x.array[i];++i) continue;
        x.array[i-1]=x.array[0];
        x.array[0]=1;
        x.array[i]--;
        b=true;
      }
      for (l=x.array.length,i=1;i<l;++i){
        if (x.array[i]>MAX_SAFE_INTEGER){
          x.array[i+1]=(x.array[i+1]||0)+1;
          x.array[0]=x.array[i]+1;
          for (var j=1;j<=i;++j) x.array[j]=0;
          b=true;
        }
      }
    }while(b);
    if (!x.array.length) x.array=[0];
    return x;
  };
  P.toNumber=function (){
    //console.log(this.array);
    if (this.sign==-1) return -1*this.abs();
    if (this.array.length>=2&&(this.array[1]>=2||this.array[1]==1&&this.array[0]>Math.log10(Number.MAX_VALUE))) return Infinity;
    if (this.array[1]==1) return Math.pow(10,this.array[0]);
    return this.array[0];
  };
  P.toString=function (){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0])) return "NaN";
    if (!isFinite(this.array[0])) return "Infinity";
    var s="";
    if (this.array.length>=2){
      for (var i=this.array.length-1;i>=2;--i){
        var q=i>=5?"{"+i+"}":"^".repeat(i);
        if (this.array[i]>1) s+="(10"+q+")^"+this.array[i]+" ";
        else if (this.array[i]==1) s+="10"+q;
      }
    }
    if (!this.array[1]) s+=String(this.toNumber());
    else if (this.array[1]<3) s+="e".repeat(this.array[1]-1)+Math.pow(10,this.array[0]-Math.floor(this.array[0]))+"e"+Math.floor(this.array[0]);
    else if (this.array[1]<8) s+="e".repeat(this.array[1])+this.array[0];
    else s+="(10^)^"+this.array[1]+" "+this.array[0];
    return s;
  };
  //from break_eternity.js
  var decimalPlaces=function decimalPlaces(value,places){
    var len=places+1;
    var numDigits=Math.ceil(Math.log10(Math.abs(value)));
    var rounded=Math.round(value*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
    return parseFloat(rounded.toFixed(Math.max(len-numDigits,0)));
  };
  P.toStringWithDecimalPlaces=function (places,applyToOpNums){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0])) return "NaN";
    if (!isFinite(this.array[0])) return "Infinity";
    var b=0;
    var s="";
    var m=Math.pow(10,places);
    if (this.array.length>=2){
      for (var i=this.array.length-1;!b&&i>=2;--i){
        var x=this.array[i];
        if (applyToOpNums&&x>=m){
          ++i;
          b=x;
          x=1;
        }else if (applyToOpNums&&this.array[i-1]>=m){
          ++x;
          b=this.array[i-1];
        }
        var q=i>=5?"{"+i+"}":"^".repeat(i);
        if (x>1) s+="(10"+q+")^"+x+" ";
        else if (x==1) s+="10"+q;
      }
    }
    var k=this.array[0];
    var l=this.array[1]||0;
    if (k>m){
      k=Math.log10(k);
      ++l;
    }
    if (b) s+=decimalPlaces(b,places);
    else if (!l) s+=String(decimalPlaces(k,places));
    else if (l<3) s+="e".repeat(l-1)+decimalPlaces(Math.pow(10,k-Math.floor(k)),places)+"e"+decimalPlaces(Math.floor(k),places);
    else if (l<8) s+="e".repeat(l)+decimalPlaces(k,places);
    else if (applyToOpNums) s+="(10^)^"+decimalPlaces(l,places)+" "+decimalPlaces(k,places);
    else s+="(10^)^"+l+" "+decimalPlaces(k,places);
    return s;
  };
  //these are from break_eternity.js as well
  P.toExponential=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0]).toExponential(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toFixed=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0]).toFixed(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toPrecision=function (places,applyToOpNums){
    if (this.array[0]===0) return (this.sign*this.array[0]).toFixed(places-1,applyToOpNums);
    if (this.array.length==1&&this.array[0]<1e-6) return this.toExponential(places-1,applyToOpNums);
    if (this.array.length==1&&places>Math.log10(this.array[0])) return this.toFixed(places-Math.floor(Math.log10(this.array[0]))-1,applyToOpNums);
    return this.toExponential(places-1,applyToOpNums);
  };
  P.valueOf=function (){
    return this.toString();
  };
  //Note: toArray() would be impossible without changing the layout of the array or lose the information about the sign
  P.toJSON=function (){
    if (OmegaNum.serializeMode==OmegaNum.JSON){
      return {
        array:this.array.slice(0),
        sign:this.sign
      };
    }else if (OmegaNum.serializeMode==OmegaNum.STRING){
      return this.toString();
    }
  };
  P.toHyperE=function (){
    if (this.sign==-1) return "-"+this.abs().toHyperE();
    if (isNaN(this.array[0])) return "NaN";
    if (!isFinite(this.array[0])) return "Infinity";
    if (this.lt(OmegaNum.MAX_SAFE_INTEGER)) return String(this.array[0]);
    if (this.lt(OmegaNum.E_MAX_SAFE_INTEGER)) return "E"+this.array[0];
    var r="E"+this.array[0]+"#"+this.array[1];
    for (var i=2;i<this.array.length;++i){
      r+="#"+(this.array[i]+1);
    }
    return r;
  };
  Q.fromNumber=function (input){
    if (typeof input!="number") throw Error(invalidArgument+"Expected Number");
    var x=new OmegaNum();
    x.array[0]=Math.abs(input);
    x.sign=input<0?-1:1;
    x.standardize();
    return x;
  };
  Q.fromString=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var isJSON=false;
    if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
      try {
        JSON.parse(input);
      }finally{
        isJSON=true;
      }
    }
    if (isJSON){
      return OmegaNum.fromJSON(input);
    }
    var x=new OmegaNum();
    x.array=[0];
    if (!isOmegaNum.test(input)){
      console.warn(omegaNumError+"Malformed input: "+input);
      x.array=[NaN];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2==1;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[NaN];
    else if (input=="Infinity") x.array=[Infinity];
    else{
      var a,b,c,d,i;
      while (input){
        if (/^\(?10[\^\{]/.test(input)){
          if (input[0]=="("){
            input=input.substring(1);
          }
          var arrows;
          if (input[2]=="^"){
            a=input.substring(2).search(/[^\^]/);
            arrows=a;
            b=a+2;
          }else{
            a=input.indexOf("}");
            arrows=Number(input.substring(3,a));
            b=a+1;
          }
          if (arrows>=OmegaNum.maxArrow){
            console.warn("Number too large to reasonably handle it: tried to "+arrows.add(2)+"-ate.");
            x.array=[Infinity];
            break;
          }
          input=input.substring(b);
          if (input[0]==")"){
            a=input.indexOf(" ");
            c=Number(input.substring(2,a));
            input=input.substring(a+1);
          }else{
            c=1;
          }
          if (arrows==1){
            x.array[1]=(x.array[1]||0)+c;
          }else if (arrows==2){
            a=x.array[1]||0;
            b=x.array[0]||0;
            if (b>=1e10) ++a;
            if (b>=10) ++a;
            x.array[0]=a;
            x.array[1]=0;
            x.array[2]=(x.array[2]||0)+c;
          }else{
            a=x.array[arrows-1]||0;
            b=x.array[arrows-2]||0;
            if (b>=10) ++a;
            for (i=1;i<arrows;++i){
              x.array[i]=0;
            }
            x.array[0]=a;
            x.array[arrows]=(x.array[arrows]||0)+c;
          }
        }else{
          break;
        }
      }
      a=input.split(/[Ee]/);
      b=[x.array[0],0];
      c=1;
      for (i=a.length-1;i>=0;--i){
        if (a[i]) d=Number(a[i]);
        else d=1;
        //The things that are already there
        if (b[0]<MAX_E&&b[1]===0){
          b[0]=Math.pow(10,c*b[0]);
        }else if (c==-1){
          if (b[1]===0){
            b[0]=Math.pow(10,c*b[0]);
          }else if (b[1]==1&&b[0]<=Math.log10(Number.MAX_VALUE)){
            b[0]=Math.pow(10,c*Math.pow(10,b[0]));
          }else{
            b[0]=0;
          }
          b[1]=0;
        }else{
          b[1]++;
        }
        //Multiplying coefficient
        if (b[1]===0){
          b[0]*=Number(d);
        }else if (b[1]==1){
          b[0]+=Math.log10(Number(d));
        }else if (b[1]==2&&b[0]<MAX_E+Math.log10(Math.log10(Number(d)))){
          b[0]+=Math.log10(1+Math.pow(10,Math.log10(Math.log10(Number(d)))-b[0]));
        }
        //Carrying
        if (b[0]<MAX_E&&b[1]){
          b[0]=Math.pow(10,b[0]);
          b[1]--;
        }else if (b[0]>MAX_SAFE_INTEGER){
          b[0]=Math.log10(b[0]);
          b[1]++;
        }
      }
      x.array[0]=b[0];
      x.array[1]=(x.array[1]||0)+b[1];
    }
    if (negateIt) x.sign*=-1;
    x.standardize();
    return x;
  };
  Q.fromArray=function (input1,input2){
    var array,sign;
    if (input1 instanceof Array&&(input2===undefined||typeof input2=="number")){
      array=input1;
      sign=input2;
    }else if (input2 instanceof Array&&typeof input1=="number"){
      array=input2;
      sign=input1;
    }else{
      throw Error(invalidArgument+"Expected an Array [and Boolean]");
    }
    var x=new OmegaNum();
    x.array=array.slice(0);
    if (sign) x.sign=Number(sign);
    else x.sign=1;
    x.standardize();
    return x;
  };
  Q.fromObject=function (input){
    if (typeof input!="object") throw Error(invalidArgument+"Expected Object");
    if (input===null) return OmegaNum.ZERO.clone();
    if (input instanceof Array) return OmegaNum.fromArray(input);
    if (input instanceof OmegaNum) return new OmegaNum(input);
    if (!(input.array instanceof Array)) throw Error(invalidArgument+"Expected that property 'array' exists");
    if (input.sign!==undefined&&typeof input.sign!="number") throw Error(invalidArgument+"Expected that property 'sign' is Number");
    var x=new OmegaNum();
    x.array=input.array.slice(0);
    x.sign=Number(input.sign)||1;
    x.standardize();
    return x;
  };
  Q.fromJSON=function (input){
    if (typeof input=="object") return OmegaNum.fromObject(parsedObject);
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var parsedObject,x;
    try{
      parsedObject=JSON.parse(input);
    }catch(e){
      parsedObject=null;
      throw e;
    }finally{
      x=OmegaNum.fromObject(parsedObject);
    }
    parsedObject=null;
    return x;
  };
  Q.fromHyperE=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var x=new OmegaNum();
    x.array=[0];
    if (!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(input)){
      console.warn(omegaNumError+"Malformed input: "+input);
      x.array=[NaN];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2===0;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[NaN];
    else if (input=="Infinity") x.array=[Infinity];
    else if (input[0]!="E"){
      x.array[0]=Number(input);
    }else if (input.indexOf("#")==-1){
      x.array[0]=Number(input.substring(1));
      x.array[1]=1;
    }else{
      var array=input.substring(1).split("#");
      for (var i=0;i<array.length;++i){
        var t=Number(array[i]);
        if (i>=2){
          --t;
        }
        x.array[i]=t;
      }
    }
    if (negateIt) x.sign*=-1;
    x.standardize();
    return x;
  };
  P.clone=function (){
    var temp=new OmegaNum();
    temp.array=this.array.slice(0);
    temp.sign=this.sign;
    return temp;
  };
  // OmegaNum methods

  /*
   *  clone
   *  config/set
   */

  /*
   * Create and return a OmegaNum constructor with the same configuration properties as this OmegaNum constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;
    function OmegaNum(input,input2) {
      var x=this;
      if (!(x instanceof OmegaNum)) return new OmegaNum(input,input2);
      x.constructor=OmegaNum;
      var parsedObject=null;
      if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
        try {
          parsedObject=JSON.parse(input);
        }catch(e){
          //lol just keep going
        }
      }
      var temp,temp2;
      if (typeof input=="number"&&!(input2 instanceof Array)){
        temp=OmegaNum.fromNumber(input);
      }else if (parsedObject){
        temp=OmegaNum.fromObject(parsedObject);
      }else if (typeof input=="string"&&input[0]=="E"){
        temp=OmegaNum.fromHyperE(input);
      }else if (typeof input=="string"){
        temp=OmegaNum.fromString(input);
      }else if (input instanceof Array||input2 instanceof Array){
        temp=OmegaNum.fromArray(input,input2);
      }else if (input instanceof OmegaNum){
        temp=input.array.slice(0);
        temp2=input.sign;
      }else if (typeof input=="object"){
        temp=OmegaNum.fromObject(input);
      }else{
        temp=[NaN];
        temp2=1;
      }
      if (typeof temp2=="undefined"){
        x.array=temp.array;
        x.sign=temp.sign;
      }else{
        x.array=temp;
        x.sign=temp2;
      }
      return x;
    }
    OmegaNum.prototype = P;

    OmegaNum.JSON = 0;
    OmegaNum.STRING = 1;
    
    OmegaNum.NONE = 0;
    OmegaNum.NORMAL = 1;
    OmegaNum.ALL = 2;

    OmegaNum.clone=clone;
    OmegaNum.config=OmegaNum.set=config;
    
    //OmegaNum=Object.assign(OmegaNum,Q);
    for (var prop in Q){
      if (Q.hasOwnProperty(prop)){
        OmegaNum[prop]=Q[prop];
      }
    }
    
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['maxArrow', 'serializeMode', 'debug'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    OmegaNum.config(obj);
    
    return OmegaNum;
  }

  function defineConstants(obj){
    for (var prop in R){
      if (R.hasOwnProperty(prop)){
        if (Object.defineProperty){
          Object.defineProperty(obj,prop,{
            configurable: false,
            enumerable: true,
            writable: false,
            value: new OmegaNum(R[prop])
          });
        }else{
          obj[prop]=new OmegaNum(R[prop]);
        }
      }
    }
    return obj;
  }

  /*
   * Configure global settings for a OmegaNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. OmegaNum.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(omegaNumError+'Object expected');
    }
    var i,p,v,
      ps = [
        'maxArrow',1,Number.MAX_SAFE_INTEGER,
        'serializeMode',0,1,
        'debug',0,2
      ];
    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  // Create and configure initial OmegaNum constructor.
  OmegaNum=clone(OmegaNum);

  OmegaNum=defineConstants(OmegaNum);

  OmegaNum['default']=OmegaNum.OmegaNum=OmegaNum;

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return OmegaNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = OmegaNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.OmegaNum = OmegaNum;
  }
})(this);
