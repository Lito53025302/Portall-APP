async function createVisitor(visitorData, residentUid) {
    try {
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 12);
        
        const visitor = {
            ...visitorData,
            residentUid,
            tokenCreatedAt: new Date().toISOString(),
            tokenExpiresAt: tokenExpiresAt.toISOString(),
            status: 'pendente',
            failedAttempts: 0
        };
        
        const docRef = await firebaseApp.firestore.collection('visitors').add(visitor);
        return { id: docRef.id, ...visitor };
    } catch (error) {
        throw new Error('Failed to create visitor: ' + error.message);
    }
}

async function getVisitorsByResident(residentUid) {
    try {
        const snapshot = await firebaseApp.firestore
            .collection('visitors')
            .where('residentUid', '==', residentUid)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error('Failed to get visitors: ' + error.message);
    }
}

async function updateVisitorStatus(visitorId, status, additionalData = {}) {
    try {
        const updateData = {
            status,
            ...additionalData,
            updatedAt: new Date().toISOString()
        };
        
        if (status === 'liberado') {
            updateData.entryTimestamp = new Date().toISOString();
        } else if (status === 'saida_registrada') {
            updateData.exitTimestamp = new Date().toISOString();
        }
        
        await firebaseApp.firestore.collection('visitors').doc(visitorId).update(updateData);
        return true;
    } catch (error) {
        throw new Error('Failed to update visitor: ' + error.message);
    }
}

async function searchVisitorByToken(token) {
    try {
        const snapshot = await firebaseApp.firestore
            .collection('visitors')
            .where('token', '==', token)
            .get();
        
        if (snapshot.docs.length === 0) {
            return null;
        }
        
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        throw new Error('Failed to search visitor: ' + error.message);
    }
}

async function reactivateVisitorToken(visitorId) {
    try {
        const newToken = generateToken();
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 12);
        
        await firebaseApp.firestore.collection('visitors').doc(visitorId).update({
            token: newToken,
            tokenCreatedAt: new Date().toISOString(),
            tokenExpiresAt: tokenExpiresAt.toISOString(),
            failedAttempts: 0,
            status: 'pendente'
        });
        
        return newToken;
    } catch (error) {
        throw new Error('Failed to reactivate token: ' + error.message);
    }
}
