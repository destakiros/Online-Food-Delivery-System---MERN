
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

/**
 * LOGISTICS CONTROL SYSTEM V1.0.4 - PRODUCTION BUILD
 * Managed by Internal Development Team
 */
dotenv.config();

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        
        app.listen(PORT, () => {
            console.log(`
┌──────────────────────────────────────────────────────────┐
│      IN-N-OUT ENTERPRISE LOGISTICS CONTROL NODE          │
├──────────────────────────────────────────────────────────┤
│ Environment: [ PRODUCTION ]                              │
│ Build ID:    V1.0.4-LATEST                               │
│ Cluster:     Node.js Active                              │
│ Port:        ${PORT}                                         │
│ Health:      [ STABLE ]                                  │
└──────────────────────────────────────────────────────────┘
            `);
        });
    } catch (err) {
        console.error('CRITICAL ERROR: SYSTEM UNABLE TO INITIALIZE PORT BINDING', err);
        process.exit(1);
    }
};

startServer();
