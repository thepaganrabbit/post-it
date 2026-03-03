import { useButtonPositioningState } from '@/store';
import { ActionButtonProps } from '@/types';
import react from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';

const FloatingActionButton = ({ onClick, currentState }: ActionButtonProps) => {
    const position = useButtonPositioningState((state) => state.position);
    return (
        <>
            <div className={`fixed ${position} mr-4 mb-4`} style={{zIndex: 238388389293434}}>
                <Button variant="primary" className="rounded-circle p-3" 
                onClick={() => onClick(!currentState)}>
                    <PlusCircleFill color='white' size={68} />
                </Button>
            </div>
        </>
    );
};

export default FloatingActionButton;