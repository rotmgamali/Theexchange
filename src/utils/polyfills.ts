import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Robust polyfill for Buffer
if (typeof global !== 'undefined') {
    global.Buffer = Buffer;
} else if (typeof globalThis !== 'undefined') {
    (globalThis as any).Buffer = Buffer;
} else if (typeof window !== 'undefined') {
    (window as any).Buffer = Buffer;
}

// Ensure 'global' exists on web
if (typeof global === 'undefined') {
    if (typeof globalThis !== 'undefined') {
        (globalThis as any).global = globalThis;
    } else if (typeof window !== 'undefined') {
        (window as any).global = window;
    }
}
