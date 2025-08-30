import Button from '@/components/Base/Button';
import Lucide from '@/components/Base/Lucide';
import { Dialog } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react'

function ConfirmationModal({showDeleteModal, setShowDeleteModal, onDelete,  message}) {
    return (
        <div>
            <Dialog open={showDeleteModal} onClose={()=> {
                setShowDeleteModal(false);
                }}
                >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            {message}
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button type="button" variant="outline-secondary" onClick={()=> {
                            setShowDeleteModal(false);
                            }}
                            className="w-24 mr-1"
                            >
                            Cancel
                        </Button>
                        <Button type="button" variant="danger" className="w-24" onClick={()=>onDelete()}>
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}

export default ConfirmationModal