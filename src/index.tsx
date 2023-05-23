import ReactDOM from 'react-dom';
import App from './App';
import '@/styles/reset.scss';
import '@/styles/global.scss';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root'),
);
