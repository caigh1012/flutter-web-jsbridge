import { useEffect, useState } from 'react';
import { headerButtonCallBack } from './helpers/native/register';
import { executeNative } from './helpers/native/msg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    headerButtonCallBack((data: number) => {
      console.log(data, '原生传递的参数');
      setCount((prev) => prev + data);
      return 4545646545;
    });
  }, []);

  return (
    <div className="app">
      5454454545count:{count} <button onClick={() => setCount(count + 1)}>count++</button>
      <div>
        <button onClick={() => executeNative()}>调取原生的APP弹框</button>
      </div>
    </div>
  );
}

export default App;
