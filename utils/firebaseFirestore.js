async function createVisitor(visitorData, residentUid) {
    try {
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 12);
        
        const visitor = {
            ...visitorData,
            residentUid,
            tokenCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            tokenExpiresAt: firebase.firestore.Timestamp.fromDate(tokenExpiresAt),
            status: 'pendente',
            failedAttempts: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await firebaseDb.collection('visitors').add(visitor);
        console.log('Visitor created with ID:', docRef.id);
        return { id: docRef.id, ...visitor };
    } catch (error) {
        console.error('Create visitor error:', error);
        throw new Error('Failed to create visitor. Please try again.');
    }
}

async function getVisitorsByResident(residentUid) {
    try {
        const snapshot = await firebaseDb
            .collection('visitors')
            .where('residentUid', '==', residentUid)
            .orderBy('createdAt', 'desc')
            .get();
        
        const visitors = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
        
        console.log(`Loaded ${visitors.length} visitors for resident`);
        return visitors;
    } catch (error) {
        console.error('Get visitors error:', error);
        throw new Error('Failed to load visitors. Please refresh the page.');
    }
}

async function updateVisitorStatus(visitorId, status, additionalData = {}) {
    try {
        const updateData = {
            status,
            ...additionalData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (status === 'liberado') {
            updateData.entryTimestamp = firebase.firestore.FieldValue.serverTimestamp();
        } else if (status === 'saida_registrada') {
            updateData.exitTimestamp = firebase.firestore.FieldValue.serverTimestamp();
        }
        
        await firebaseDb.collection('visitors').doc(visitorId).update(updateData);
        console.log('Visitor status updated to:', status);
        return true;
    } catch (error) {
        console.error('Update visitor error:', error);
        throw new Error('Failed to update visitor status. Please try again.');
    }
}

async function searchVisitorByToken(token) {
    try {
        const snapshot = await firebaseDb
            .collection('visitors')
            .where('token', '==', token)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) {
            console.log('No visitor found with token:', token);
            return null;
        }
        
        const doc = snapshot.docs[0];
        const visitor = { 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
        
        console.log('Visitor found:', visitor.name);
        return visitor;
    } catch (error) {
        console.error('Search visitor error:', error);
        throw new Error('Failed to search visitor. Please try again.');
    }
}

async function reactivateVisitorToken(visitorId) {
    try {
        const newToken = generateToken();
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 12);
        
        await firebaseDb.collection('visitors').doc(visitorId).update({
            token: newToken,
            tokenCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            tokenExpiresAt: firebase.firestore.Timestamp.fromDate(tokenExpiresAt),
            failedAttempts: 0,
            status: 'pendente'
        });
        
        console.log('Token reactivated:', newToken);
        return newToken;
    } catch (error) {
        console.error('Reactivate token error:', error);
        throw new Error('Failed to reactivate token. Please try again.');
    }
}
