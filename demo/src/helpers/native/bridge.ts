import { JSBridge } from 'bridge';

// export default import.meta.env.MODE === 'development' ? new MockBridge() : new JSBridge();

export default new JSBridge();
