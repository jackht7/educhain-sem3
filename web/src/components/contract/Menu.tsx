import { PlusIcon } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const components = [
  { type: 'job', name: 'Job' },
  { type: 'payment', name: 'Payment' },
];

export default function Menu() {
  const { setNodes, setEdges } = useReactFlow();

  const onProviderClick = ({ name, type }: { name: string; type: string }) => {
    const location = Math.random() * 500;

    setNodes((prevNodes) => {
      const lastNode = prevNodes[prevNodes.length - 1];

      const newNode = {
        id: `${prevNodes.length + 1}`,
        data: { label: name },
        type: type,
        position: { x: lastNode ? lastNode.position.x + 400 : location, y: lastNode ? lastNode.position.y : location },
      };

      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `e${prevNodes.length}-${newNode.id}`,
          source: `${prevNodes.length}`,
          target: newNode.id,
          type: 'customEdge',
          animated: true,
        },
      ]);

      return [...prevNodes, newNode];
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PlusIcon />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {components.map((component) => (
          <DropdownMenuItem key={component.type} onClick={() => onProviderClick(component)}>
            {component.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
