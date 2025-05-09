
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { GeneratedTest } from '@/types';
import { getSavedTests, deleteTest } from '@/services/fileService';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ImageIcon, FileText, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const [tests, setTests] = useState<GeneratedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Load tests on mount
  useEffect(() => {
    const loadTests = () => {
      try {
        const savedTests = getSavedTests();
        setTests(savedTests);
      } catch (error) {
        console.error('Failed to load tests', error);
        toast.error('Failed to load tests');
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  // Handle test deletion
  const handleDeleteTest = (id: string) => {
    try {
      const success = deleteTest(id);
      if (success) {
        setTests((prev) => prev.filter((test) => test.id !== id));
        toast.success('Test deleted successfully');
      } else {
        toast.error('Failed to delete test');
      }
    } catch (error) {
      console.error('Failed to delete test', error);
      toast.error('Failed to delete test');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your display ad tests
            </p>
          </div>
          <Link to="/create">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <ImageIcon className="mr-1 h-4 w-4" /> New Test
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          </div>
        ) : tests.length > 0 ? (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Creatives</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      {new Date(test.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{test.creativeCount}</TableCell>
                    <TableCell>{test.author}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/test/${test.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setConfirmDelete(test.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">No tests created yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first display ad test to get started
            </p>
            <Link to="/create">
              <Button>Create New Test</Button>
            </Link>
          </div>
        )}

        <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this test and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => confirmDelete && handleDeleteTest(confirmDelete)}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
