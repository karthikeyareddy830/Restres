import Card from '../ui/Card';

const AdminStatsCard = ({ title, value, icon, color }) => {
  return (
    <Card className="p-6 flex items-center hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
      </div>
    </Card>
  );
};

export default AdminStatsCard;
