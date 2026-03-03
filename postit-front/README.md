# Post-it 

---

a simple post it postIt front end app.

### Closest Color 

```TypeScript
import { getClosestColor } from '@/utils/colorUtils';

const userColor = '#ab4c23';
const palette = ['#ff0000', '#00ff00', '#0000ff', '#a52a2a']; // example shades

const closestShade = getClosestColor(userColor, palette);
console.log(closestShade); // e.g., "#a52a2a"

```