import numpy as np, wave, json, sys
SP=sys.argv[1]; SR=44100; FPS=30
def load(n):
    w=wave.open(f'{SP}/{n}.wav'); return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(np.float32)/32768
src={n:load(n) for n in ['simulacro','calma','satisfazacredito']}
def seg(n,a,dur): s=src[n][int(a*SR):int(a*SR)+int(dur*SR)].copy(); return s
def fade(x,fi=0.01,fo=0.01):
    x=x.copy(); a=int(fi*SR); b=int(fo*SR)
    if a: x[:a]*=np.linspace(0,1,a)[:,None]
    if b: x[-b:]*=np.linspace(1,0,b)[:,None]
    return x
def onset_near(n,t,win=0.25):
    d=src[n][:,0]+src[n][:,1]; hop=256; i0=int((t-win)*SR); i1=int((t+win)*SR)
    e=np.array([np.sum(d[i:i+hop]**2) for i in range(i0,i1,hop)]); f=np.maximum(0,np.diff(e)); k=np.argmax(f)
    return (i0+(k+1)*hop)/SR
def stutter(n,t,dur,start_grain=0.16,end_grain=0.03):
    # repeats short grains, accelerating (like App3.triggerFreeze)
    out=[]; tot=0; g=start_grain; pos=t
    while tot<dur:
        gr=fade(seg(n,pos,g),0.003,0.006); out.append(gr); tot+=g
        g=max(end_grain,g*0.86)
        if np.random.rand()<0.25: pos+=g*0.5
    x=np.concatenate(out)[:int(dur*SR)]
    # bitcrush-ish decimation increasing
    steps=np.linspace(1,12,len(x)).astype(int)
    idx=np.arange(len(x)); idx=idx-(idx%steps); x=x[idx]
    return x
def lowpass(x,cut_start,cut_end):
    y=np.zeros_like(x); z=np.zeros(2); cs=np.geomspace(cut_start,cut_end,len(x))
    a=1-np.exp(-2*np.pi*cs/SR)
    for i in range(len(x)): z+= a[i]*(x[i]-z); y[i]=z
    return y
def tape_stop(x):
    n=len(x); sp=np.linspace(1,0.05,n); pos=np.cumsum(sp); pos=pos[pos<n-1]
    return x[pos.astype(int)]*np.linspace(1,0,len(pos))[:,None]
def bands(x,dur):
    m=x.mean(1); N=int(dur*FPS); out=[]; hop=SR//FPS; win=2048; han=np.hanning(win)
    fr=np.fft.rfftfreq(win,1/SR)
    for i in range(N):
        c=i*hop; s=m[max(0,c-win//2):c+win//2]
        if len(s)<win: s=np.pad(s,(0,win-len(s)))
        sp=np.abs(np.fft.rfft(s*han))
        out.append([sp[(fr>20)&(fr<180)].mean(),sp[(fr>180)&(fr<2500)].mean(),sp[(fr>2500)&(fr<12000)].mean(),np.sqrt(np.mean(s**2))])
    a=np.array(out); a=a/np.percentile(a,97,axis=0); a=np.clip(a,0,1.3)
    # onset: positive diff of bass+rms
    on=np.maximum(0,np.diff(a[:,0]+a[:,3],prepend=0)); on=on/np.percentile(on,98)
    return [[round(float(v),3) for v in list(r)+[min(1.5,o)]] for r,o in zip(a,on)]
def write(name,x):
    x=np.clip(x,-1,1); w=wave.open(f'{SP}/v/{name}.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
np.random.seed(7)
# ---------- VIDEO 1 : o site ----------
c_on=onset_near('calma',140.0,0.4); print('calma drop',c_on)
s_on=onset_near('satisfazacredito',36.9,0.3); print('satisfaz onset',s_on)
parts=[]; marks={}
A=fade(seg('calma',c_on-2.0,8.0),0.4,0.02); parts.append(A)           # 0-8
parts.append(stutter('calma',c_on+5.6,0.25,0.07,0.02))                # 8-8.25
B=fade(seg('satisfazacredito',s_on,6.25),0.005,0.02); parts.append(B) # 8.25-14.5
parts.append(stutter('satisfazacredito',s_on+6.0,0.25,0.06,0.02))     # 14.5-14.75
C=fade(seg('simulacro',47.3,7.45),0.005,0.01); parts.append(C)        # 14.75-22.2
parts.append(stutter('simulacro',54.45,1.4,0.18,0.025))               # 22.2-23.6
D=fade(seg('simulacro',55.6,10.8),0.005,1.8); parts.append(D)         # 23.6-34.4 (créditos + card)
v1=np.concatenate(parts); dur1=len(v1)/SR; print('v1 dur',dur1)
write('v1',v1); json.dump({'fps':FPS,'dur':dur1,'bands':bands(v1,dur1)},open(f'{SP}/v/v1.json','w'))
# ---------- VIDEO 2 : simulacro ----------
parts=[]
P=fade(seg('simulacro',45.0,22.8),0.02,0.01); parts.append(P)         # 0-22.8
parts.append(stutter('simulacro',67.35,1.4,0.2,0.025))                # 22.8-24.2
parts.append(np.zeros((int(0.25*SR),2),np.float32))                  # silence hit 24.2-24.45
E=seg('simulacro',71.2,7.3); n=int(1.6*SR); E[:n]=lowpass(E[:n],300,16000); E=fade(E,0.01,2.2); parts.append(E)  # 24.45-31.75
v2=np.concatenate(parts); dur2=len(v2)/SR; print('v2 dur',dur2)
write('v2',v2); json.dump({'fps':FPS,'dur':dur2,'bands':bands(v2,dur2)},open(f'{SP}/v/v2.json','w'))
