export default function RecentMembers({ members }) {

  const recentMembers = [...members]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">

        👥 Recently Registered Members

      </h2>

      {

        recentMembers.length === 0 ?

          <p className="text-gray-500">

            No members found.

          </p>

          :

          <div className="space-y-4">

            {

              recentMembers.map(member => (

                <div

                  key={member.id}

                  className="flex items-center gap-4 border-b pb-3"

                >

                  <img

                    src={member.avatar}

                    alt={member.name}

                    className="w-14 h-14 rounded-full object-cover"

                  />

                  <div>

                    <h3 className="font-semibold">

                      {member.name}

                    </h3>

                    <p className="text-gray-500 text-sm">

                      {member.department}

                    </p>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">

                      {member.membership}

                    </span>

                  </div>

                </div>

              ))

            }

          </div>

      }

    </div>

  );

}