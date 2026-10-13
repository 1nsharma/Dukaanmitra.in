
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp
} from "firebase/firestore";
import { MemoryNode } from "../types";

export const memoryService = {
  // Extract and store memory triplets from text
  async remember(storeId: string, entityName: string, type: MemoryNode['type'], relationship: string, targetEntityName: string, _properties: Record<string, unknown> = {}) {
    try {
      // 1. Find or create source node
      const sourceNode = await this.getOrCreateNode(storeId, entityName, type);
      
      // 2. Find or create target node (usually general or specific)
      const targetNode = await this.getOrCreateNode(storeId, targetEntityName, 'preference');

      // 3. Create or update relation
      const relationsRef = collection(db, 'memory_relations');
      const q = query(
        relationsRef, 
        where('storeId', '==', storeId),
        where('sourceId', '==', sourceNode.id),
        where('targetId', '==', targetNode.id),
        where('relationship', '==', relationship)
      );
      
      const existingRel = await getDocs(q);
      if (existingRel.empty) {
        await addDoc(relationsRef, {
          storeId,
          sourceId: sourceNode.id,
          targetId: targetNode.id,
          relationship,
          strength: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        const relDoc = existingRel.docs[0];
        await updateDoc(doc(db, 'memory_relations', relDoc.id), {
          strength: (relDoc.data().strength || 1) + 1,
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error("Memory error:", error);
      return false;
    }
  },

  async getOrCreateNode(storeId: string, entity: string, type: MemoryNode['type']): Promise<MemoryNode> {
    const nodesRef = collection(db, 'memory_nodes');
    const q = query(nodesRef, where('storeId', '==', storeId), where('entity', '==', entity.toLowerCase()));
    const existing = await getDocs(q);

    if (!existing.empty) {
      const data = existing.docs[0].data();
      return { id: existing.docs[0].id, ...data } as MemoryNode;
    }

    const newNode = {
      storeId,
      entity: entity.toLowerCase(),
      type,
      properties: {},
      lastUpdated: new Date().toISOString()
    };
    
    const docRef = await addDoc(nodesRef, newNode);
    return { id: docRef.id, ...newNode };
  },

  // Retrieve relevant semantic triplets for a customer
  async getContext(storeId: string, entityName: string): Promise<string[]> {
    try {
      const nodesRef = collection(db, 'memory_nodes');
      const qNode = query(nodesRef, where('storeId', '==', storeId), where('entity', '==', entityName.toLowerCase()));
      const nodeRes = await getDocs(qNode);
      
      if (nodeRes.empty) return [];

      const nodeId = nodeRes.docs[0].id;
      const relsRef = collection(db, 'memory_relations');
      const qRel = query(relsRef, where('storeId', '==', storeId), where('sourceId', '==', nodeId));
      const relRes = await getDocs(qRel);

      const triplets: string[] = [];
      for (const relDoc of relRes.docs) {
        const relData = relDoc.data();
        const targetDoc = await getDocs(query(nodesRef, where('storeId', '==', storeId), where('__name__', '==', relData.targetId)));
        if (!targetDoc.empty) {
          const targetData = targetDoc.docs[0].data();
          triplets.push(`${entityName} ${relData.relationship} ${targetData.entity}`);
        }
      }
      
      return triplets;
    } catch (err) {
       console.error("Context retrieval error:", err);
       return [];
    }
  }
};
